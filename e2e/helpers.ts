import { expect, type Locator, type Page } from "@playwright/test";

/**
 * メッセージ領域をクリックして、対象が表示されるまで進める。
 * ティラノは「1クリック目=文字送り完了、2クリック目=次ページ」の挙動を持つため、
 * 固定回数ではなく表示されるまでクリックする方式にしている。
 */
export async function advanceUntil(page: Page, target: Locator, maxClicks = 60) {
  for (let i = 0; i < maxClicks; i++) {
    if (await target.isVisible().catch(() => false)) return;
    await page.mouse.click(640, 620);
    await page.waitForTimeout(200);
  }
  await expect(target).toBeVisible();
}

export async function advanceUntilVisible(page: Page, text: string | RegExp, maxClicks = 60) {
  await advanceUntil(page, page.getByText(text).first(), maxClicks);
}

/** glinkボタン(タグ属性のスペースは&nbsp;になるがPlaywrightのテキスト照合は空白を正規化する) */
export function glink(page: Page, hasText: string) {
  return page.locator(".glink_button", { hasText }).first();
}

/**
 * 文字送りアニメーションの完了を待つ。
 * 文字送り中(is_adding_text=true)にセーブするとそのフラグごと保存され、
 * ロード後にクリック受付が復元されないため、セーブ前に必ず呼ぶこと。
 */
export async function waitForTextSettled(page: Page) {
  await page.waitForFunction(
    () => (window as any).TYRANO?.kag?.stat?.is_adding_text === false,
    undefined,
    { timeout: 10_000 },
  );
}
