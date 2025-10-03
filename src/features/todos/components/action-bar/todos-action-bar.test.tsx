import { renderWithProviders } from "@/test-utils/render.tsx";
import { screen } from "@testing-library/react";
import { TodosActionBar } from "./todos-action-bar.tsx";

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

describe("TodosActionBar", () => {
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
	it("does not render the action bar when selection is empty", () => {
		renderWithProviders(<TodosActionBar />, {
			selection: [],
		});

		expect(screen.queryByText(/selected/i)).not.toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: /apagar todas/i })
		).not.toBeInTheDocument();
	});

	it("renders selection count and delete button when there is selection", () => {
		renderWithProviders(<TodosActionBar />, {
			selection: [1, 2, 3],
		});

		expect(screen.getByText(/3\s+selected/i)).toBeInTheDocument();

		const deleteButton = screen.getByRole("button", { name: /apagar todas/i });
		expect(deleteButton).toBeInTheDocument();
	});

 it("keeps the delete button enabled by default and clickable", () => {
		renderWithProviders(<TodosActionBar />, {
			selection: [10],
		});

		const deleteButton = screen.getByRole("button", { name: /apagar todas/i });
		expect(deleteButton).toBeEnabled();

		deleteButton.click();

		expect(deleteButton).toBeInTheDocument();
	});
});
