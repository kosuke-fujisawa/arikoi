export type SourceLocation = {
  file: string;
  line: number;
  column?: number;
};

export type AssetKind = "background" | "bgm" | "se";

export type Asset = {
  id: string;
  kind: AssetKind;
  path: string;
};

export type DialogueStep = {
  kind: "dialogue";
  id: string;
  speaker: string;
  text: string;
  source: SourceLocation;
};

export type NarrationStep = {
  kind: "narration";
  id: string;
  text: string;
  source: SourceLocation;
};

export type ChoiceOption = {
  id: string;
  label: string;
  targetStepId: string;
};

export type ChoiceStep = {
  kind: "choice";
  id: string;
  options: ChoiceOption[];
  source: SourceLocation;
};

export type JumpStep = {
  kind: "jump";
  id: string;
  targetStepId: string;
  source: SourceLocation;
};

export type SetVariableStep = {
  kind: "set_variable";
  id: string;
  name: string;
  value: unknown;
  source: SourceLocation;
};

export type EndingStep = {
  kind: "ending";
  id: string;
  endingId: string;
  source: SourceLocation;
};

export type Step =
  | DialogueStep
  | NarrationStep
  | ChoiceStep
  | JumpStep
  | SetVariableStep
  | EndingStep;

export type Scene = {
  id: string;
  title: string;
  background?: string;
  bgm?: string;
  steps: Step[];
  source: SourceLocation;
};

/**
 * 1言語分のStoryBundle。言語切り替えは、arikoi側で
 * story-bundle.en.json / story-bundle.ja.json を選んで
 * 読み込むファイル単位で行う(型自体は単言語のまま)。
 */
export type StoryBundle = {
  schemaVersion: string;
  storyBuildId: string;
  title: string;
  entrySceneId: string;
  scenes: Scene[];
  assets: Asset[];
};

export type ChoiceRecord = {
  sceneId: string;
  stepId: string;
  choiceId: string;
  selectedAt: string;
};

/**
 * 画面状態は保存せず、StoryBundle上の位置と進行状態のみ保存する。
 * slotIdは単一デフォルト値("default")のみを想定し、スロット選択UIは作らない。
 */
export type SaveData = {
  appVersion: string;
  storySchemaVersion: string;
  storyBuildId: string;
  slotId: string;
  savedAt: string;
  currentSceneId: string;
  currentStepId: string;
  variables: Record<string, unknown>;
  choiceHistory: ChoiceRecord[];
  readStepIds: string[];
};

export type ValidationErrorCode =
  | "invalid-json"
  | "unsupported-schema-version"
  | "story-build-mismatch"
  | "unknown-scene"
  | "unknown-step";

export type ValidationError = {
  code: ValidationErrorCode;
  message: string;
};
