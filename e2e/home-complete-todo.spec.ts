import { test, expect, type Page } from "@playwright/test";

async function waitForTodosToLoad(page: Page): Promise<void> {
	await page.goto("/");
	await page
		.getByRole("checkbox", { name: /select row/i })
		.first()
		.waitFor({ state: "visible" });
}

async function ensureAndClickComplete(page: Page): Promise<void> {
	const completeButton = page.locator("#complete-todo").first();
	if (await completeButton.count()) {
		await expect(completeButton).toBeVisible();
		await completeButton.click();
		return;
	}

	const pendingButton = page.locator(".pending-todo").first();
	await expect(pendingButton).toBeVisible();
	await pendingButton.click();

	const nowCompleteButton = page.locator(".complete-todo").first();
	await expect(nowCompleteButton).toBeVisible();
	await nowCompleteButton.click();
}

test("home loads, table appears, completing a todo shows success message", async ({
	page,
}) => {
	await waitForTodosToLoad(page);

	await ensureAndClickComplete(page);

	await expect(page.getByText(/sucesso ao atualizar tarefa!/i)).toBeVisible({
		timeout: 5000,
	});
});
