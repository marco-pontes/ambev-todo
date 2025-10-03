import { renderWithProviders } from "@/test-utils/render.tsx";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodosTable } from "./todos-table.tsx";
import { TodoStatus, type Todo } from "@/features/todos/types/todo.ts";

describe("TodosTable", () => {
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
		{
			id: 3,
			title: "Task C",
			description: "Desc C",
			status: TodoStatus.PENDING,
		},
	];

	it("renders table header and body rows based on context todos", () => {
		const setSelection = vi.fn();
		renderWithProviders(<TodosTable />, {
			todos,
			selection: [],
			setSelection: setSelection as unknown as React.Dispatch<
				React.SetStateAction<Array<number>>
			>,
		});

		const headers = screen.getAllByRole("columnheader");
		expect(headers.length).toBe(5);

		const rowCheckboxes = screen.getAllByRole("checkbox", {
			name: /select row/i,
		});
		expect(rowCheckboxes.length).toBe(todos.length);

		expect(screen.getByText(/Task A/i)).toBeInTheDocument();
		expect(screen.getByText(/Task B/i)).toBeInTheDocument();
		expect(screen.getByText(/Task C/i)).toBeInTheDocument();
	});

	it("select-all in header selects all ids into selection via context setSelection", async () => {
		const user = userEvent.setup();
		const setSelection = vi.fn();

		renderWithProviders(<TodosTable />, {
			todos,
			selection: [],
			setSelection: setSelection as unknown as React.Dispatch<
				React.SetStateAction<Array<number>>
			>,
		});

		const selectAll = screen.getByRole("checkbox", {
			name: /select all rows/i,
		});
		await user.click(selectAll);

		expect(setSelection).toHaveBeenCalledTimes(1);
		expect(setSelection).toHaveBeenCalledWith(todos.map((t) => t.id));
	});

	it("row checkbox toggles selection using functional updater", async () => {
		const user = userEvent.setup();
		const setSelection = vi.fn();

		renderWithProviders(<TodosTable />, {
			todos,
			selection: [],
			setSelection: setSelection as unknown as React.Dispatch<
				React.SetStateAction<Array<number>>
			>,
		});

		const [first] = screen.getAllByRole("checkbox", { name: /select row/i });
		await user.click(first!);

		expect(setSelection).toHaveBeenCalledTimes(1);
	});

	it("reflects checked state when some ids are pre-selected via context", () => {
		const setSelection = vi.fn();

		renderWithProviders(<TodosTable />, {
			todos,
			selection: [2],
			setSelection: setSelection as unknown as React.Dispatch<
				React.SetStateAction<Array<number>>
			>,
		});

		const checkboxes = screen.getAllByRole("checkbox", { name: /select row/i });

		expect(checkboxes[1]).toBeChecked();
		expect(checkboxes[0]).not.toBeChecked();
		expect(checkboxes[2]).not.toBeChecked();

		const selectAll = screen.getByRole("checkbox", {
			name: /select all rows/i,
		});
		expect(selectAll).toBeInTheDocument();
	});
});
