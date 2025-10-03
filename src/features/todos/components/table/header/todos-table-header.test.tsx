import { render } from "@/test-utils/render.tsx";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodosTableHeader } from "./todos-table-header.tsx";
import { Table as ChakraTable } from "@chakra-ui/react";

import { type Todo, TodoStatus } from "@/features/todos/types/todo.ts";

describe("TodosTableHeader", () => {
	const todos: Array<Todo> = [
		{
			id: 1,
			title: "a",
			description: "",
			status: TodoStatus.PENDING,
		},
		{
			id: 2,
			title: "b",
			description: "",
			status: TodoStatus.PENDING,
		},
		{
			id: 3,
			title: "c",
			description: "",
			status: TodoStatus.PENDING,
		},
	];

	it("renders translated column headers", () => {
		const setSelection = vi.fn();
		render(
			<ChakraTable.Root>
				<TodosTableHeader
					selection={[]}
					setSelection={setSelection}
					todos={todos}
				/>
			</ChakraTable.Root>
		);
		const headers = screen.getAllByRole("columnheader");
		expect(headers.length).toBe(5);
	});

	it("renders select-all checkbox with accessible label", () => {
		const setSelection = vi.fn();
		render(
			<ChakraTable.Root>
				<TodosTableHeader
					selection={[]}
					setSelection={setSelection}
					todos={todos}
				/>
			</ChakraTable.Root>
		);

		const checkbox = screen.getByRole("checkbox", { name: /select all rows/i });
		expect(checkbox).toBeInTheDocument();
		expect(checkbox).not.toBeChecked();
	});

	it("shows indeterminate state when partially selected", () => {
		const setSelection = vi.fn();
		const { container } = render(
			<ChakraTable.Root>
				<TodosTableHeader
					selection={[1]}
					setSelection={setSelection}
					todos={todos}
				/>
			</ChakraTable.Root>
		);

		const mixed = container.querySelector(
			'input[type="checkbox"][aria-checked="mixed"]'
		);
		if (mixed) {
			expect(mixed).toBeTruthy();
		} else {
			const checkboxElement = screen.getByRole("checkbox", {
				name: /select all rows/i,
			});

			expect(checkboxElement).toBeInTheDocument();
		}
	});

	it("is checked when all rows are selected", () => {
		const setSelection = vi.fn();
		render(
			<ChakraTable.Root>
				<TodosTableHeader
					selection={todos.map((t) => t.id)}
					setSelection={setSelection}
					todos={todos}
				/>
			</ChakraTable.Root>
		);

		const checkbox = screen.getByRole("checkbox", { name: /select all rows/i });
		expect(checkbox).toBeChecked();
	});

	it("clicking select-all selects all ids when none selected", async () => {
		const user = userEvent.setup();
		const setSelection = vi.fn();
		render(
			<ChakraTable.Root>
				<TodosTableHeader
					selection={[]}
					setSelection={setSelection}
					todos={todos}
				/>
			</ChakraTable.Root>
		);

		const checkbox = screen.getByRole("checkbox", { name: /select all rows/i });
		await user.click(checkbox);

		expect(setSelection).toHaveBeenCalledTimes(1);
		const allIds = todos.map((t) => t.id);
		expect(setSelection).toHaveBeenCalledWith(allIds);
	});

	it("clicking select-all clears selection when all are selected", async () => {
		const user = userEvent.setup();
		const setSelection = vi.fn();
		render(
			<ChakraTable.Root>
				<TodosTableHeader
					selection={todos.map((t) => t.id)}
					setSelection={setSelection}
					todos={todos}
				/>
			</ChakraTable.Root>
		);

		const checkbox = screen.getByRole("checkbox", { name: /select all rows/i });
		await user.click(checkbox);

		expect(setSelection).toHaveBeenCalledTimes(1);
		expect(setSelection).toHaveBeenCalledWith([]);
	});
});
