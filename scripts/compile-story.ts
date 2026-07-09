// tsumugai compile --target web の生出力(type/stepIndex参照)を、
// arikoi runtimeの内部契約(kind/id参照、src/lib/story/types.ts)に変換して書き出す。
//
// tsumugaiの出力はstepにidを持たず、jump/choiceの飛び先を
// { sceneId, stepIndex } という位置参照で持つ。arikoi側のengine/save/SaveDataは
// 「stepをidで指す」前提で実装済みのため、ここでコンパイル時に変換する
// (runtime側の内部形式は変えず、tsumugai側の出力形式変化を吸収する層)。
//
// 使い方:
//   node scripts/compile-story.ts <entry.md> <output.json>
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, extname, join } from "node:path";
import { pathToFileURL } from "node:url";

type RawSourceLocation = { file: string; line: number; column?: number | null };
type RawTarget = { sceneId: string; stepIndex: number };

type RawStep =
  | { type: "narration"; text: string; source: RawSourceLocation }
  | { type: "dialogue"; speaker: string; text: string; source: RawSourceLocation }
  | {
      type: "choice";
      items: { label: string; target: RawTarget; source: RawSourceLocation }[];
      source: RawSourceLocation;
    }
  | { type: "jump"; target: RawTarget; source: RawSourceLocation }
  | { type: "ending"; id: string; source: RawSourceLocation };

type RawScene = { id: string; title: string; source: RawSourceLocation; steps: RawStep[] };
type RawAsset = { kind: "background" | "bgm" | "se"; path: string };

type RawStoryBundle = {
  schemaVersion: string;
  storyBuildId: string;
  title: string;
  entrySceneId: string;
  scenes: RawScene[];
  assets: RawAsset[];
};

/** arikoi側がconvert()で解釈できるtsumugai compile出力のschemaVersion。 */
const SUPPORTED_RAW_SCHEMA_VERSIONS: readonly string[] = ["1"];

/** 変換後、arikoi runtimeが読み込むStoryBundleのschemaVersion(src/lib/story/engine.tsのSUPPORTED_SCHEMA_VERSIONSと対応)。 */
const ARIKOI_SCHEMA_VERSION = "0.1.0";

function stepId(sceneId: string, index: number): string {
  return `${sceneId}#${index}`;
}

function convertStep(sceneId: string, index: number, step: RawStep) {
  const id = stepId(sceneId, index);

  switch (step.type) {
    case "narration":
      return { kind: "narration", id, text: step.text, source: step.source };
    case "dialogue":
      return { kind: "dialogue", id, speaker: step.speaker, text: step.text, source: step.source };
    case "choice":
      return {
        kind: "choice",
        id,
        options: step.items.map((item, optionIndex) => ({
          id: `${id}-choice-${optionIndex}`,
          label: item.label,
          targetStepId: stepId(item.target.sceneId, item.target.stepIndex),
        })),
        source: step.source,
      };
    case "jump":
      return {
        kind: "jump",
        id,
        targetStepId: stepId(step.target.sceneId, step.target.stepIndex),
        source: step.source,
      };
    case "ending":
      return { kind: "ending", id, endingId: step.id, source: step.source };
    default: {
      const unknown: { type: string } = step;
      throw new Error(`未知のstep種別です: ${unknown.type}`);
    }
  }
}

function assetId(asset: RawAsset): string {
  return `${asset.kind}-${basename(asset.path, extname(asset.path))}`;
}

export function convert(raw: RawStoryBundle, gameTitle?: string) {
  if (!SUPPORTED_RAW_SCHEMA_VERSIONS.includes(raw.schemaVersion)) {
    throw new Error(
      `未対応のtsumugai compile出力schemaVersionです: ${raw.schemaVersion} (対応: ${SUPPORTED_RAW_SCHEMA_VERSIONS.join(", ")})`,
    );
  }

  return {
    schemaVersion: ARIKOI_SCHEMA_VERSION,
    storyBuildId: raw.storyBuildId,
    // raw.titleはエントリファイル(1シーン)のtitleであり、ゲーム全体のタイトルではない。
    // tsumugaiはゲーム全体のタイトルという概念を持たないため、呼び出し側から明示的に渡す。
    title: gameTitle ?? raw.title,
    entrySceneId: raw.entrySceneId,
    scenes: raw.scenes.map((scene) => ({
      id: scene.id,
      title: scene.title,
      source: scene.source,
      steps: scene.steps.map((step, index) => convertStep(scene.id, index, step)),
    })),
    assets: raw.assets.map((asset) => ({
      id: assetId(asset),
      kind: asset.kind,
      path: asset.path,
    })),
  };
}

function main() {
  const [, , entryFile, outputPath, gameTitle] = process.argv;
  if (!entryFile || !outputPath) {
    console.error("使い方: node scripts/compile-story.ts <entry.md> <output.json> [gameTitle]");
    process.exit(1);
  }

  const tmpDir = mkdtempSync(join(tmpdir(), "arikoi-story-compile-"));
  const rawOutputPath = join(tmpDir, "raw-story-bundle.json");

  try {
    execFileSync("tsumugai", ["compile", entryFile, "--target", "web", "--output", rawOutputPath], {
      stdio: "inherit",
    });

    const raw = JSON.parse(readFileSync(rawOutputPath, "utf8")) as RawStoryBundle;
    const bundle = convert(raw, gameTitle);
    writeFileSync(outputPath, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");
    console.log(`StoryBundleを書き出しました: ${outputPath}`);
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
