import { render } from "@/test-utils/render.tsx";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Table as ChakraTable } from "@chakra-ui/react";
import { TodosTableBody } from "./todos-table-body.tsx";
import { TodoStatus, type Todo } from "@/features/todos/types/todo.ts";

vi.mock(
	"@/context/ApplicationContext.tsx",
	(): Record<string, unknown> => ({
		useApplicationContext: () => ({
			handleEditTodo: vi.fn(),
			mutateUpdate: vi.fn(),
			mutateDelete: vi.fn(),
			isPending: false,
		}),
	})
);

describe("TodosTableBody", () => {
	const todos: Array<Todo> = [
		{
			id: 1,
			title: "Task A",
			description: "Desc A",
			status: TodoStatus.PENDING,
		},
		{
			id: 2,
			title: "Task B",
			description: "Desc B",
			status: TodoStatus.COMPLETED,
		},
	];

	it("renders a row for each todo with cells and actions", () => {
		const setSelection = vi.fn();
		render(
			<ChakraTable.Root>
				<TodosTableBody
					selection={[]}
					setSelection={setSelection}
					todos={todos}
				/>
			</ChakraTable.Root>
		);

		const rows = screen.getAllByRole("row");
		expect(rows.length).toBe(todos.length);

		expect(screen.getByText(/Task A/i)).toBeInTheDocument();
		expect(screen.getByText(/Desc A/i)).toBeInTheDocument();
		expect(screen.getByText("Pendente")).toBeInTheDocument();

		expect(screen.getByText(/Task B/i)).toBeInTheDocument();
		expect(screen.getByText(/Desc B/i)).toBeInTheDocument();
		expect(screen.getByText("Concluída")).toBeInTheDocument();

		const buttons = screen.getAllByRole("button");
		expect(buttons.length).toBeGreaterThanOrEqual(2);
	});

	it("renders a selection checkbox for each row with accessible label", () => {
		const setSelection = vi.fn();
		render(
			<ChakraTable.Root>
				<TodosTableBody
					selection={[]}
					setSelection={setSelection}
					todos={todos}
				/>
			</ChakraTable.Root>
		);

		const checkboxes = screen.getAllByRole("checkbox", { name: /select row/i });
		expect(checkboxes.length).toBe(todos.length);
	});

	it("checkbox reflects selection state", () => {
		const setSelection = vi.fn();
		render(
			<ChakraTable.Root>
				<TodosTableBody
					selection={[1]}
					setSelection={setSelection}
					todos={todos}
				/>
			</ChakraTable.Root>
		);

		const [first, second] = screen.getAllByRole("checkbox", {
			name: /select row/i,
		});
		expect(first).toBeChecked();
		expect(second).not.toBeChecked();
	});

	it("clicking a row checkbox adds id to selection when unchecked", async () => {
		const user = userEvent.setup();
		const setSelection = vi.fn();
		render(
			<ChakraTable.Root>
				<TodosTableBody
					selection={[]}
					setSelection={setSelection}
					todos={todos}
				/>
			</ChakraTable.Root>
		);

		const [first] = screen.getAllByRole("checkbox", { name: /select row/i });
		expect(first).not.toBeNull();
		await user.click(first!);

		expect(setSelection).toHaveBeenCalledTimes(1);
	});

	it("clicking a selected row checkbox removes id from selection", async () => {
		const user = userEvent.setup();
		const setSelection = vi.fn();
		render(
			<ChakraTable.Root>
				<TodosTableBody
					selection={[1, 2]}
					setSelection={setSelection}
					todos={todos}
				/>
			</ChakraTable.Root>
		);

		const [first] = screen.getAllByRole("checkbox", { name: /select row/i });
		await user.click(first!);

		expect(setSelection).toHaveBeenCalledTimes(1);
	});
});
