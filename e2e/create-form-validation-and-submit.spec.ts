import { test, expect } from "@playwright/test";

async function waitForCreateForm(
	page: import("@playwright/test").Page
): Promise<void> {
	await page.goto("/create");
	await page.locator("#title").waitFor({ state: "visible" });
}

test("create page: form loads, shows error when title cleared, and shows success after valid submit", async ({
	page,
}) => {
	await waitForCreateForm(page);

	const titleInput = page.locator("#title");
	await expect(titleInput).toBeVisible();

	await titleInput.type("Novo título");
	await titleInput.fill("");

	const submitButton = page.getByRole("button", { name: /salvar/i });
	await expect(submitButton).toBeVisible();
	await submitButton.click();

	await expect(page.getByText(/existem erros no formulário!/i)).toBeVisible({
		timeout: 5000,
	});

	await titleInput.fill("Minha nova tarefa");
	await submitButton.click();

	await expect(submitButton).toBeEnabled();

	const successText = page.getByText(/sucesso ao criar tarefa!/i);
	await expect(successText).toBeVisible({ timeout: 10000 });
});
