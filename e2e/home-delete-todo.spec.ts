import { test, expect } from '@playwright/test';

// Helper: wait until the todos table has rendered at least one row checkbox
async function waitForTodosToLoad(page: import('@playwright/test').Page): Promise<void> {
  // The app first renders a SkeletonText, then loads todos and shows the table with row checkboxes labeled "Select row"
  await page.goto('/');
  // Wait for at least one row checkbox to appear
  await page.getByRole('checkbox', { name: /select row/i }).first().waitFor({ state: 'visible' });
}

// Helper: delete the first visible todo by clicking its delete button in the row actions
async function deleteFirstTodo(page: import('@playwright/test').Page): Promise<void> {
  // Find the first row in the table by locating the first delete button (id="delete-todo")
  const deleteButton = page.locator('#delete-todo').first();
  await expect(deleteButton).toBeVisible();
  await deleteButton.click();
}

// E2E: Load home, wait for table, delete a todo, and assert success message
// This test assumes the dev server is started via playwright.config.ts webServer.
// The API is provided by simple-fake-api (started by `pnpm start` command) and should respond for delete.

test('home loads, table appears, deleting a todo shows success message', async ({ page }) => {
  await waitForTodosToLoad(page);

  // Ensure there is at least one row checkbox, meaning rows are present
  const firstRowCheckbox = page.getByRole('checkbox', { name: /select row/i }).first();
  await expect(firstRowCheckbox).toBeVisible();

  // Perform delete action on the first row
  await deleteFirstTodo(page);

  // Expect the success message from i18n to appear
  // pt-BR: "Sucesso ao apagar tarefa!"
  await expect(page.getByText(/sucesso ao apagar tarefa!/i)).toBeVisible({ timeout: 5000 });
});
