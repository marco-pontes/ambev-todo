import { renderWithProviders } from "@/test-utils/render.tsx";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodosForm } from "./todos-form.tsx";
import { TodoStatus, type Todo } from "@/features/todos/types/todo.ts";

describe("TodosForm", () => {
	it("renders labels, inputs, select and submit button", () => {
		const { container } = renderWithProviders(
			<TodosForm submitDisabled={false} onSubmitTodo={vi.fn()} />
		);

		expect(screen.getByText(/título/i)).toBeInTheDocument();
		expect(screen.getByText(/descrição/i)).toBeInTheDocument();
		expect(screen.getByText(/status/i)).toBeInTheDocument();

		expect(container.querySelector("#title")).toBeTruthy();
		expect(container.querySelector("#description")).toBeTruthy();
		expect(container.querySelector("#status")).toBeTruthy();

		expect(screen.getByRole("button", { name: /salvar/i })).toBeInTheDocument();
	});

	it("shows validation errors when submitting empty form", async () => {
		const user = userEvent.setup();
 	const { container } = renderWithProviders(
			<TodosForm submitDisabled={false} onSubmitTodo={vi.fn()} />
		);

		const title = container.querySelector("#title")!;
		await user.type(title, "a");
		await user.clear(title);

		await user.click(screen.getByRole("button", { name: /salvar/i }));

		expect(container.querySelector("#title")).toBeTruthy();
		expect(container.querySelector("#status")).toBeTruthy();

		await waitFor(() => {
			const errors = container.querySelectorAll(".chakra-field__errorText");
			expect(errors.length).toBeGreaterThan(0);
		});
	});

	it("submits valid data (create mode) and resets fields after submit when id is undefined", async () => {
		const user = userEvent.setup();
		const onSubmitTodo = vi.fn();

 	const { container } = renderWithProviders(
			<TodosForm submitDisabled={false} onSubmitTodo={onSubmitTodo} />
		);

		const titleInput = container.querySelector("#title");
		const descriptionInput = container.querySelector("#description");
		await user.type(titleInput!, "Nova tarefa");
		await user.type(descriptionInput!, "Descrição");

		const select = container.querySelector("#status")!;
		await user.selectOptions(select, TodoStatus.COMPLETED);

		await user.click(screen.getByRole("button", { name: /salvar/i }));

		expect(onSubmitTodo).toHaveBeenCalledTimes(1);
		expect(onSubmitTodo).toHaveBeenCalledWith({
			id: undefined,
			title: "Nova tarefa",
			description: "Descrição",
			status: TodoStatus.COMPLETED,
		});

		await waitFor(() => {
			const c = container;
			expect(c.querySelector("#title")).toHaveValue("");
			expect(c.querySelector("#description")).toHaveValue("");
			expect(c.querySelector("#status")).toHaveValue(TodoStatus.PENDING);
		});
	});

	it("submits valid data (edit mode) and does not reset when id is provided", async () => {
		const user = userEvent.setup();
		const onSubmitTodo = vi.fn();

		const existing: Partial<Todo> = {
			id: 10,
			title: "Existente",
			description: "Antiga",
			status: TodoStatus.PENDING,
		};

 	renderWithProviders(
			<TodosForm
				{...existing}
				submitDisabled={false}
				onSubmitTodo={onSubmitTodo}
			/>
		);

		const titleInput = document.querySelector("#title")!;
		await user.clear(titleInput);
		await user.type(titleInput, "Atualizada");

		const select = document.querySelector("#status")!;
		await user.selectOptions(select, TodoStatus.COMPLETED);

		await user.click(screen.getByRole("button", { name: /salvar/i }));

		expect(onSubmitTodo).toHaveBeenCalledWith({
			id: 10,
			title: "Atualizada",
			description: "Antiga",
			status: TodoStatus.COMPLETED,
		});

		expect(document.querySelector("#title")).toHaveValue("Atualizada");
	});

	it("disables submit when submitDisabled is true (shows loading state)", () => {
 	renderWithProviders(<TodosForm submitDisabled onSubmitTodo={vi.fn()} />);

		const button = document.querySelector(
			'button[type="submit"]'
		) as HTMLButtonElement;
		expect(button).toBeTruthy();
		expect(button?.disabled).toBe(true);
	});
});
