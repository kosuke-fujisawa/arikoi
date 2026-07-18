import { expect, test } from "@playwright/test";
import { advanceUntil, advanceUntilVisible, glink } from "./helpers";

test("start -> advance -> choose -> ending -> back to title", async ({ page }) => {
  test.setTimeout(90_000);

  await page.goto("/");

  // タイトル画面
  await expect(glink(page, "Start")).toBeVisible({ timeout: 15_000 });
  await glink(page, "Start").click();

  // プロローグ冒頭
  await advanceUntilVisible(page, "The walk home from school");
  await advanceUntilVisible(page, "I keep meaning to ask you something");

  // 選択肢(直前の[p]のクリック待ちを挟むため、表示されるまで送る)
  const ask = glink(page, "Ask her what");
  await advanceUntil(page, ask);
  await ask.click();

  // ask分岐 → closing → エンディング
  await advanceUntilVisible(page, "Never mind. Some other day");
  await advanceUntilVisible(page, "the distance between you exactly what");
  await advanceUntilVisible(page, "The End");

  // クリックでタイトルへ戻る
  await advanceUntilVisible(page, "Start");
  await expect(glink(page, "Start")).toBeVisible();
});

test("wait branch also reaches the ending", async ({ page }) => {
  test.setTimeout(90_000);

  await page.goto("/");
  await expect(glink(page, "Start")).toBeVisible({ timeout: 15_000 });
  await glink(page, "Start").click();

  await advanceUntilVisible(page, "I keep meaning to ask you something");

  const wait = glink(page, "Let the silence hold");
  await advanceUntil(page, wait);
  await wait.click();

  await advanceUntilVisible(page, "Thanks. For not asking");
  await advanceUntilVisible(page, "The End");
});
