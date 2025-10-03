import { test, expect, type Page } from "@playwright/test";

async function waitForTodosToLoad(page: Page): Promise<void> {
	await page.goto("/");
	await page
		.getByRole("checkbox", { name: /select row/i })
		.first()
		.waitFor({ state: "visible" });
}

test("home loads, edit a todo, change title, save and see update success message", async ({
	page,
}) => {
	await waitForTodosToLoad(page);

	const editButton = page.locator(".edit-todo").first();
	await expect(editButton).toBeVisible();
	await editButton.click();

	const titleInput = page.locator("#title");
	await expect(titleInput).toBeVisible();
	await titleInput.fill("");
	await titleInput.type("Título atualizado pelo Playwright");

	const saveButton = page.getByRole("button", { name: /salvar/i });
	await expect(saveButton).toBeVisible();
	await saveButton.click();

	await expect(page.getByText(/sucesso ao atualizar tarefa!/i)).toBeVisible({
		timeout: 5000,
	});
});
