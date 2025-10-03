import { render } from "@/test-utils/render.tsx";
import { screen } from "@testing-library/react";
import { TodosDialog } from "./todos-dialog.tsx";
import type { Todo } from "@/features/todos/types/todo.ts";

const handleUpdateTodo = vi.fn();
const setEditModalOpen = vi.fn();

vi.mock(
	"@/context/ApplicationContext.tsx",
	(): Record<string, unknown> => ({
		useApplicationContext: () => ({
			handleUpdateTodo,
			activeEditTodo: {
				id: 1,
				title: "Task A",
				description: "Desc",
			} as Partial<Todo>,
			editModalOpen: true,
			setEditModalOpen,
			isPending: false,
		}),
	})
);

vi.mock(
	"@/features/todos/components/form/todos-form.tsx",
	(): Record<string, unknown> => ({
		TodosForm: ({
			onSubmitTodo,
			submitDisabled,
			title,
		}: {
			onSubmitTodo: (todo: Partial<Todo>) => void;
			submitDisabled?: boolean;
			title?: string;
		}) => (
			<div>
				{title && <div data-testid="form-title">{title}</div>}
				<button
					disabled={Boolean(submitDisabled)}
					onClick={() => {
						onSubmitTodo({ id: 1, title: "Updated" });
					}}
				>
					Submit Form
				</button>
			</div>
		),
	})
);

vi.mock(
	"@chakra-ui/react",
	async (importOriginal): Promise<Record<string, unknown>> => {
		const original: Record<string, unknown> = await importOriginal();
		return {
			...original,
			Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
		} as Record<string, unknown>;
	}
);

describe("TodosDialog", () => {
	beforeAll(() => {
		vi.useFakeTimers();
	});
	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.clearAllTimers();
	});
	afterAll(() => {
		vi.useRealTimers();
	});
	beforeEach(() => {
		handleUpdateTodo.mockClear();
		setEditModalOpen.mockClear();
	});

	it("renders when open and shows the translated title", () => {
		render(<TodosDialog />);

		expect(screen.getByText(/editar tarefa/i)).toBeInTheDocument();

		expect(
			screen.getByRole("button", { name: /submit form/i })
		).toBeInTheDocument();
	});

	it("closes when clicking the CloseButton", () => {
		vi.useRealTimers();
		render(<TodosDialog />);

		const closeButton = screen.getByRole("button", { name: /close/i });
		closeButton.click();

		expect(closeButton).toBeInTheDocument();

		vi.useFakeTimers();
	});

	it("submits form: closes modal then calls handleUpdateTodo with payload", () => {
		render(<TodosDialog />);

		const submit = screen.getByRole("button", { name: /submit form/i });
		submit.click();

		expect(setEditModalOpen).toHaveBeenCalledWith(false);
		expect(handleUpdateTodo).toHaveBeenCalledWith({ id: 1, title: "Updated" });
	});

	it("disables form submit when isPending is true", async () => {
		const contextModule = await import("@/context/ApplicationContext.tsx");
		vi.spyOn(contextModule, "useApplicationContext").mockReturnValue({
			handleUpdateTodo,
			activeEditTodo: { id: 1, title: "Task A" } as Partial<Todo>,
			editModalOpen: true,
			setEditModalOpen,
			isPending: true,
		} as unknown as ReturnType<typeof contextModule.useApplicationContext>);

		render(<TodosDialog />);

		const submit = screen.getByRole("button", { name: /submit form/i });
		expect(submit).toBeDisabled();
	});
});
