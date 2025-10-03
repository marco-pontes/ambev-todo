import { renderWithProviders } from "@/test-utils/render.tsx";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Home } from "./Home.tsx";
import { TodoStatus, type Todo } from "@/features/todos/types/todo.ts";
import type { JSX } from "react";

vi.mock(
	"@/features/todos/components/table",
	(): Record<string, unknown> => ({
		TodosTable: (): JSX.Element => <div data-testid="todos-table">TABLE</div>,
	})
);

vi.mock(
	"@/features/todos/components/pagination/todos-pagination.tsx",
	(): Record<string, unknown> => ({
		TodosPagination: (): JSX.Element => (
			<button data-testid="todos-pagination" type="button">
				PAGINATION
			</button>
		),
	})
);

vi.mock(
	"@/features/todos/components/dialog",
	(): Record<string, unknown> => ({
		TodosDialog: (): JSX.Element => (
			<div data-testid="todos-dialog">DIALOG</div>
		),
	})
);

vi.mock(
	"@/features/todos/components/action-bar/todos-action-bar.tsx",
	(): Record<string, unknown> => ({
		TodosActionBar: (): JSX.Element => (
			<div data-testid="todos-action-bar">ACTIONBAR</div>
		),
	})
);

describe("Home Page", () => {
	it("renders translated heading and skeleton when todos are not yet loaded", () => {
		const { container } = renderWithProviders(<Home />, { todos: undefined });

		expect(
			screen.getByRole("heading", { name: /lista de tarefas/i })
		).toBeInTheDocument();

		const skeletons = container.querySelectorAll(".chakra-skeleton");
		expect(skeletons.length).toBeGreaterThan(0);

		expect(screen.queryByTestId("todos-table")).not.toBeInTheDocument();
		expect(screen.queryByTestId("todos-pagination")).not.toBeInTheDocument();
	});

	it("renders TodosTable and TodosPagination when todos are available", () => {
		const todos: Array<Todo> = [
			{ id: 1, title: "A", description: "d1", status: TodoStatus.PENDING },
			{ id: 2, title: "B", description: "d2", status: TodoStatus.COMPLETED },
		];

		renderWithProviders(<Home />, { todos });

		expect(document.querySelectorAll(".chakra-skeleton").length).toBe(0);

		expect(screen.getByTestId("todos-table")).toBeInTheDocument();
		expect(screen.getByTestId("todos-pagination")).toBeInTheDocument();
	});

	it("always renders TodosDialog and TodosActionBar containers", async () => {
		const user = userEvent.setup();

		renderWithProviders(<Home />, { todos: undefined });

		expect(screen.getByTestId("todos-dialog")).toBeInTheDocument();
		expect(screen.getByTestId("todos-action-bar")).toBeInTheDocument();

		const todos: Array<Todo> = [
			{ id: 1, title: "A", description: "d1", status: TodoStatus.PENDING },
		];

		renderWithProviders(<Home />, { todos });
		const pagination = screen.getByTestId("todos-pagination");
		await user.click(pagination);
		expect(pagination).toBeInTheDocument();
	});
});
