import { renderWithProviders } from "@/test-utils/render.tsx";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Create } from "./Create.tsx";
import type { Todo } from "@/features/todos/types/todo.ts";

vi.mock(
	"@/features/todos/components/form/todos-form.tsx",
	(): Record<string, unknown> => ({
		TodosForm: ({
			onSubmitTodo,
			submitDisabled,
		}: {
			onSubmitTodo: (todo: Partial<Todo>) => void;
			submitDisabled?: boolean;
		}) => (
			<button
				disabled={Boolean(submitDisabled)}
				onClick={() => {
					onSubmitTodo({ title: "FromCreate" });
				}}
			>
				Submit Mock Form
			</button>
		),
	})
);

describe("Create Page", () => {
	it("renders translated heading for create page", () => {
		renderWithProviders(<Create />);

		expect(
			screen.getByRole("heading", { name: /criar nova tarefa/i })
		).toBeInTheDocument();
	});

	it("passes submitDisabled to TodosForm when isPendingCreate is true", () => {
		renderWithProviders(<Create />, { isPendingCreate: true });

		const submitButton = screen.getByRole("button", {
			name: /submit mock form/i,
		});
		expect(submitButton).toBeDisabled();
	});

	it("calls mutateCreate with payload when form submits", async () => {
		const user = userEvent.setup();
		const mutateCreate = vi.fn();

		renderWithProviders(<Create />, { mutateCreate });

		const submitButton = screen.getByRole("button", {
			name: /submit mock form/i,
		});
		await user.click(submitButton);

		expect(mutateCreate).toHaveBeenCalledTimes(1);
		expect(mutateCreate).toHaveBeenCalledWith({ title: "FromCreate" });
	});
});
