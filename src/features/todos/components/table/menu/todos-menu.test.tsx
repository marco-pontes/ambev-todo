import { render } from "@/test-utils/render.tsx";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodosMenu } from "./todos-menu.tsx";
import { TodoStatus, type Todo } from "@/features/todos/types/todo.ts";

const handleEditTodo = vi.fn();
const mutateUpdate = vi.fn();
const mutateDelete = vi.fn();

vi.mock(
	"@/context/ApplicationContext.tsx",
	(): Record<string, unknown> => ({
		useApplicationContext: () => ({
			handleEditTodo,
			mutateUpdate,
			mutateDelete,
			isPending: false,
		}),
	})
);

describe("TodosMenu", () => {
	beforeEach(() => {
		handleEditTodo.mockClear();
		mutateUpdate.mockClear();
		mutateDelete.mockClear();
	});

	const pendingTodo: Todo = {
		id: 1,
		title: "Task A",
		description: "Desc A",
		status: TodoStatus.PENDING,
	};

	const completedTodo: Todo = {
		id: 2,
		title: "Task B",
		description: "Desc B",
		status: TodoStatus.COMPLETED,
	};

	it("renders edit, complete and delete buttons for a PENDING todo and triggers actions", async () => {
		const user = userEvent.setup();
		render(<TodosMenu todo={pendingTodo} />);

		const buttons = screen.getAllByRole("button");
		expect(buttons.length).toBe(3);

		await user.click(buttons[0]!);
		expect(handleEditTodo).toHaveBeenCalledWith(pendingTodo);

		await user.click(buttons[1]!);
		expect(mutateUpdate).toHaveBeenCalledWith({
			id: pendingTodo.id,
			status: TodoStatus.COMPLETED,
		});

		await user.click(buttons[2]!);
		expect(mutateDelete).toHaveBeenCalledWith(pendingTodo.id);
	});

	it("renders edit, pending and delete buttons for a COMPLETED todo and triggers actions", async () => {
		const user = userEvent.setup();
		render(<TodosMenu todo={completedTodo} />);

		const buttons = screen.getAllByRole("button");
		expect(buttons.length).toBe(3);

		await user.click(buttons[0]!);
		expect(handleEditTodo).toHaveBeenCalledWith(completedTodo);

		await user.click(buttons[1]!);
		expect(mutateUpdate).toHaveBeenCalledWith({
			id: completedTodo.id,
			status: TodoStatus.PENDING,
		});

		await user.click(buttons[2]!);
		expect(mutateDelete).toHaveBeenCalledWith(completedTodo.id);
	});

	it("disables all buttons when isPending is true", async () => {
		// Override the context mock to set isPending true for this test only
		const original = await import("@/context/ApplicationContext.tsx");
		vi.spyOn(original, "useApplicationContext").mockReturnValue({
			handleEditTodo,
			mutateUpdate,
			mutateDelete,
			isPending: true,
		} as unknown as ReturnType<typeof original.useApplicationContext>);

		const user = userEvent.setup();
		render(<TodosMenu todo={pendingTodo} />);

		const buttons = screen.getAllByRole("button");
		expect(buttons.length).toBe(3);

		buttons.forEach((button) => {
			expect(button).toBeDisabled();
		});

		await user.click(buttons[0]!);
		await user.click(buttons[1]!);
		await user.click(buttons[2]!);

		expect(handleEditTodo).not.toHaveBeenCalled();
		expect(mutateUpdate).not.toHaveBeenCalled();
		expect(mutateDelete).not.toHaveBeenCalled();
	});
});
