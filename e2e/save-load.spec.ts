import { expect, test } from "@playwright/test";
import { advanceUntil, advanceUntilVisible, glink, waitForTextSettled } from "./helpers";

test("save -> reload -> continue -> load -> reach ending", async ({ page }) => {
  test.setTimeout(120_000);

  await page.goto("/");
  await expect(glink(page, "Start")).toBeVisible({ timeout: 15_000 });
  await glink(page, "Start").click();

  // 選択肢まで進めてask分岐に入る
  await advanceUntilVisible(page, "I keep meaning to ask you something");
  await advanceUntil(page, glink(page, "Ask her what"));
  await glink(page, "Ask her what").click();
  await advanceUntilVisible(page, "Never mind. Some other day");

  // メニュー → セーブ画面 → スロット0にセーブ(クリックで即実行・確認ダイアログなし)
  await waitForTextSettled(page);
  await page.locator(".button_menu").click();
  await page.locator(".menu_save").click();
  const slot = page.locator('.save_list_item[data-num="0"]');
  await expect(slot).toBeVisible({ timeout: 10_000 });
  await slot.click();
  await expect(slot.locator(".save_list_item_date")).not.toBeEmpty({ timeout: 10_000 });

  // ページを開き直してContinue → ロード
  await page.reload();
  await expect(glink(page, "Continue")).toBeVisible({ timeout: 15_000 });
  await glink(page, "Continue").click();
  const loadSlot = page.locator('.save_list_item[data-num="0"]');
  await expect(loadSlot).toBeVisible({ timeout: 10_000 });
  await loadSlot.click();

  // セーブ地点の本文が復元され、そのままエンディングまで到達できる
  await advanceUntilVisible(page, "Never mind. Some other day");
  await advanceUntilVisible(page, "the distance between you exactly what");
  await advanceUntilVisible(page, "The End");
});
