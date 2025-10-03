import { test, expect, type Page } from "@playwright/test";

async function waitForTodosToLoad(page: Page): Promise<void> {
	await page.goto("/");
	await page
		.getByRole("checkbox", { name: /select row/i })
		.first()
		.waitFor({ state: "visible" });
}

async function ensureAndClickPending(page: Page): Promise<void> {
	const pendingButton = page.locator("#pending-todo").first();
	if (await pendingButton.count()) {
		await expect(pendingButton).toBeVisible();
		await pendingButton.click();
		return;
	}

	const completeButton = page.locator(".complete-todo").first();
	await expect(completeButton).toBeVisible();
	await completeButton.click();

	const nowPendingButton = page.locator(".pending-todo").first();
	await expect(nowPendingButton).toBeVisible();
	await nowPendingButton.click();
}

test("home loads, table appears, setting a todo to pending shows success message", async ({
	page,
}) => {
	await waitForTodosToLoad(page);

	await ensureAndClickPending(page);

	await expect(page.getByText(/sucesso ao atualizar tarefa!/i)).toBeVisible({
		timeout: 5000,
	});
});
