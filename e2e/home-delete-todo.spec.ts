import { test, expect } from "@playwright/test";

async function waitForTodosToLoad(
	page: import("@playwright/test").Page
): Promise<void> {
	await page.goto("/");

	await page
		.getByRole("checkbox", { name: /select row/i })
		.first()
		.waitFor({ state: "visible" });
}

async function deleteFirstTodo(
	page: import("@playwright/test").Page
): Promise<void> {
	const deleteButton = page.locator(".delete-todo").first();
	await expect(deleteButton).toBeVisible();
	await deleteButton.click();
}

test("home loads, table appears, deleting a todo shows success message", async ({
	page,
}) => {
	await waitForTodosToLoad(page);

	const firstRowCheckbox = page
		.getByRole("checkbox", { name: /select row/i })
		.first();
	await expect(firstRowCheckbox).toBeVisible();

	await deleteFirstTodo(page);

	await expect(page.getByText(/sucesso ao apagar tarefa!/i)).toBeVisible({
		timeout: 5000,
	});
});
