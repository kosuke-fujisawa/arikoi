import type {
  ChoiceRecord,
  Scene,
  SourceLocation,
  Step,
  StoryBundle,
  ValidationError,
} from "./types";

/** arikoi runtimeが読み込めるStoryBundleのschemaVersion。 */
export const SUPPORTED_SCHEMA_VERSIONS: readonly string[] = ["0.1.0"];

function hasSourceLocation(source: unknown): source is SourceLocation {
  return (
    typeof source === "object" &&
    source !== null &&
    typeof (source as SourceLocation).file === "string" &&
    typeof (source as SourceLocation).line === "number"
  );
}

function hasValidStepShape(step: Step): boolean {
  switch (step.kind) {
    case "narration":
      return typeof step.text === "string";
    case "dialogue":
      return typeof step.speaker === "string" && typeof step.text === "string";
    case "choice":
      return (
        Array.isArray(step.options) &&
        step.options.every(
          (option) =>
            typeof option.id === "string" &&
            typeof option.label === "string" &&
            typeof option.targetStepId === "string",
        )
      );
    case "jump":
      return typeof step.targetStepId === "string";
    case "set_variable":
      return typeof step.name === "string";
    case "ending":
      return typeof step.endingId === "string";
    default:
      return false;
  }
}

function stepTargets(step: Step): string[] {
  if (step.kind === "jump") return [step.targetStepId];
  if (step.kind === "choice") return step.options.map((option) => option.targetStepId);
  return [];
}

/**
 * StoryBundleがこのruntimeで読み込み可能かを検証する。
 * 致命的に非対応な場合でも例外は投げず、ValidationErrorを返す
 * (呼び出し側でエラー表示のみ行い、クラッシュさせないため)。
 */
export function validateStoryBundle(bundle: StoryBundle): ValidationError | null {
  if (!SUPPORTED_SCHEMA_VERSIONS.includes(bundle.schemaVersion)) {
    return {
      code: "unsupported-schema-version",
      message: `unsupported StoryBundle schemaVersion: ${bundle.schemaVersion} (supported: ${SUPPORTED_SCHEMA_VERSIONS.join(", ")})`,
    };
  }

  if (typeof bundle.storyBuildId !== "string" || bundle.storyBuildId === "") {
    return {
      code: "missing-story-build-id",
      message: "StoryBundle is missing storyBuildId",
    };
  }

  const sceneIds = new Set<string>();
  const stepIds = new Set<string>();
  for (const scene of bundle.scenes) {
    if (sceneIds.has(scene.id)) {
      return { code: "duplicate-scene-id", message: `duplicate scene id: ${scene.id}` };
    }
    sceneIds.add(scene.id);
    for (const step of scene.steps) {
      if (stepIds.has(step.id)) {
        return { code: "duplicate-step-id", message: `duplicate step id: ${step.id}` };
      }
      stepIds.add(step.id);
    }
  }

  if (!sceneIds.has(bundle.entrySceneId)) {
    return {
      code: "unknown-entry-scene",
      message: `entrySceneId not found among scenes: ${bundle.entrySceneId}`,
    };
  }

  for (const scene of bundle.scenes) {
    for (const step of scene.steps) {
      if (!hasSourceLocation(step.source)) {
        return {
          code: "missing-source-location",
          message: `missing source location: scene=${scene.id} step=${step.id}`,
        };
      }

      if (!hasValidStepShape(step)) {
        return {
          code: "invalid-step",
          message: `invalid step structure: scene=${scene.id} step=${step.id} kind=${step.kind}`,
        };
      }

      for (const target of stepTargets(step)) {
        if (!stepIds.has(target)) {
          return {
            code: "unknown-target-step",
            message: `unknown target step: ${target} (referenced from scene=${scene.id} step=${step.id})`,
          };
        }
      }
    }
  }

  return null;
}

/**
 * runtimeが保持する進行状態。Svelte/DOM/storageに依存しない。
 * SaveDataとの違いは、appVersion/slotId/savedAtを持たないこと(save.tsが付与する)。
 */
export type EngineState = {
  currentSceneId: string;
  currentStepId: string;
  variables: Record<string, unknown>;
  choiceHistory: ChoiceRecord[];
  readStepIds: string[];
};

export type View =
  | { kind: "dialogue"; speaker: string; text: string }
  | { kind: "narration"; text: string }
  | { kind: "choice"; options: { id: string; label: string }[] }
  | { kind: "ending"; endingId: string };

function findScene(bundle: StoryBundle, sceneId: string): Scene {
  const scene = bundle.scenes.find((s) => s.id === sceneId);
  if (!scene) {
    throw new Error(`scene not found: ${sceneId}`);
  }
  return scene;
}

function findStepIndex(scene: Scene, stepId: string): number {
  const index = scene.steps.findIndex((s) => s.id === stepId);
  if (index === -1) {
    throw new Error(`step not found: ${stepId} in scene ${scene.id}`);
  }
  return index;
}

function findStep(scene: Scene, stepId: string): Step {
  return scene.steps[findStepIndex(scene, stepId)];
}

function findStepPosition(
  bundle: StoryBundle,
  stepId: string,
): { scene: Scene; step: Step } {
  for (const scene of bundle.scenes) {
    const step = scene.steps.find((candidate) => candidate.id === stepId);
    if (step) return { scene, step };
  }
  throw new Error(`step not found: ${stepId}`);
}

/**
 * jump / set_variable ステップは表示対象ではないため、
 * dialogue / narration / choice / ending のいずれかに着地するまで自動的に進める。
 */
function resolveToRenderableStep(
  sceneId: string,
  stepId: string,
  bundle: StoryBundle,
  variables: Record<string, unknown>,
): { sceneId: string; stepId: string; variables: Record<string, unknown> } {
  let scene = findScene(bundle, sceneId);
  let step = findStep(scene, stepId);
  let nextVariables = variables;
  const visitedStepIds = new Set<string>();

  while (step.kind === "jump" || step.kind === "set_variable") {
    if (visitedStepIds.has(step.id)) {
      throw new Error(
        `automatic transition cycle detected: scene=${scene.id} step=${step.id}`,
      );
    }
    visitedStepIds.add(step.id);

    if (step.kind === "set_variable") {
      nextVariables = { ...nextVariables, [step.name]: step.value };
      const index = findStepIndex(scene, step.id);
      const following = scene.steps[index + 1];
      if (!following) {
        throw new Error(`no step after set_variable: ${step.id}`);
      }
      step = following;
    } else {
      const target = findStepPosition(bundle, step.targetStepId);
      scene = target.scene;
      step = target.step;
    }
  }

  return { sceneId: scene.id, stepId: step.id, variables: nextVariables };
}

function markRead(readStepIds: string[], stepId: string): string[] {
  return readStepIds.includes(stepId) ? readStepIds : [...readStepIds, stepId];
}

export function createInitialState(bundle: StoryBundle): EngineState {
  const resolved = resolveToRenderableStep(
    bundle.entrySceneId,
    findScene(bundle, bundle.entrySceneId).steps[0].id,
    bundle,
    {},
  );

  return {
    currentSceneId: resolved.sceneId,
    currentStepId: resolved.stepId,
    variables: resolved.variables,
    choiceHistory: [],
    readStepIds: markRead([], resolved.stepId),
  };
}

export function advance(state: EngineState, bundle: StoryBundle): EngineState {
  const scene = findScene(bundle, state.currentSceneId);
  const currentIndex = findStepIndex(scene, state.currentStepId);
  const currentStep = scene.steps[currentIndex];

  if (currentStep.kind !== "dialogue" && currentStep.kind !== "narration") {
    throw new Error(
      `advance() は dialogue/narration stepでのみ呼べます(現在: ${currentStep.kind})`,
    );
  }

  const nextStep = scene.steps[currentIndex + 1];
  if (!nextStep) {
    throw new Error(`no next step after ${currentStep.id}`);
  }

  const resolved = resolveToRenderableStep(
    scene.id,
    nextStep.id,
    bundle,
    state.variables,
  );

  return {
    ...state,
    currentSceneId: resolved.sceneId,
    currentStepId: resolved.stepId,
    variables: resolved.variables,
    readStepIds: markRead(state.readStepIds, resolved.stepId),
  };
}

export function choose(
  state: EngineState,
  bundle: StoryBundle,
  choiceId: string,
): EngineState {
  const scene = findScene(bundle, state.currentSceneId);
  const currentStep = findStep(scene, state.currentStepId);

  if (currentStep.kind !== "choice") {
    throw new Error(`choose() は choice stepでのみ呼べます(現在: ${currentStep.kind})`);
  }

  const option = currentStep.options.find((o) => o.id === choiceId);
  if (!option) {
    throw new Error(`unknown choiceId: ${choiceId}`);
  }

  const record: ChoiceRecord = {
    sceneId: scene.id,
    stepId: currentStep.id,
    choiceId: option.id,
    selectedAt: new Date().toISOString(),
  };

  const resolved = resolveToRenderableStep(
    scene.id,
    option.targetStepId,
    bundle,
    state.variables,
  );

  return {
    ...state,
    currentSceneId: resolved.sceneId,
    currentStepId: resolved.stepId,
    variables: resolved.variables,
    choiceHistory: [...state.choiceHistory, record],
    readStepIds: markRead(state.readStepIds, resolved.stepId),
  };
}

export function getCurrentView(state: EngineState, bundle: StoryBundle): View {
  const scene = findScene(bundle, state.currentSceneId);
  const step = findStep(scene, state.currentStepId);

  switch (step.kind) {
    case "dialogue":
      return { kind: "dialogue", speaker: step.speaker, text: step.text };
    case "narration":
      return { kind: "narration", text: step.text };
    case "choice":
      return {
        kind: "choice",
        options: step.options.map((o) => ({ id: o.id, label: o.label })),
      };
    case "ending":
      return { kind: "ending", endingId: step.endingId };
    default:
      throw new Error(`unreachable step kind: ${(step as Step).kind}`);
  }
}
