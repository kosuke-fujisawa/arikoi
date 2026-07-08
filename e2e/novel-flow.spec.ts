import { test, expect } from "@playwright/test";

test("start -> advance -> choose -> save -> reload -> load -> continue -> ending", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "A Familiar Shape of Love" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue", exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: "Start", exact: true }).click();
  await expect(page.getByText("The walk home from school")).toBeVisible();

  // advance dialogue
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Enter");
  }
  await expect(page.getByText("I keep meaning to ask you something.")).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Ask her what it is", exact: true }),
  ).toBeVisible();

  // choose option
  await page.getByRole("button", { name: "Ask her what it is", exact: true }).click();
  await expect(page.getByText("What is it?")).toBeVisible();

  // save
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByText("Saved.")).toBeVisible();

  // reload page
  await page.reload();
  await expect(page.getByRole("heading", { name: "A Familiar Shape of Love" })).toBeVisible();

  // load / continue
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText("What is it?")).toBeVisible();

  // continue advancing to reach ending
  // ask-protagonist-what -> ask-kaede-never-mind -> ask-narration-lightly
  // -> (jump) closing-narration -> closing-ending
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press("Enter");
  }

  await expect(page.getByText("-- ending_quiet_distance --")).toBeVisible();
  await expect(page.getByRole("button", { name: "Play again", exact: true })).toBeVisible();
});
