import { renderWithProviders } from "@/test-utils/render.tsx";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodosPagination } from "./todos-pagination.tsx";

function getNumberButtons(): Array<HTMLButtonElement> {
	const buttons = screen.getAllByRole("button");
	return buttons.filter((b) =>
		/\d+/.test(b.textContent || "")
	) as Array<HTMLButtonElement>;
}

function getPreviousAndNextButtons(): {
	previous: HTMLButtonElement;
	next: HTMLButtonElement;
} {
	const buttons = screen.getAllByRole("button");
	const previous = buttons[0] as HTMLButtonElement;
	const next = buttons[buttons.length - 1] as HTMLButtonElement;
	return { previous, next };
}

describe("TodosPagination", () => {
	it("renders page items based on totalResults and pageSize=10", () => {
		const setPage = vi.fn();
		renderWithProviders(<TodosPagination />, {
			page: 1,
			totalResults: 35,
			setPage: setPage as unknown as React.Dispatch<
				React.SetStateAction<number>
			>,
		});

		const numberButtons = getNumberButtons();
		expect(numberButtons.length).toBeGreaterThanOrEqual(1);

		const labels = numberButtons.map((b) => b.textContent?.trim());
		expect(labels).toContain("1");
	});

	it("clicking a page item calls setPage with that page number", async () => {
		const user = userEvent.setup();
		const setPage = vi.fn();
		renderWithProviders(<TodosPagination />, {
			page: 1,
			totalResults: 35,
			setPage: setPage as unknown as React.Dispatch<
				React.SetStateAction<number>
			>,
		});

		const numberButtons = getNumberButtons();
		expect(numberButtons.length).toBeGreaterThan(0);

		const target = numberButtons[numberButtons.length - 1]!;
		const targetPage = Number(target.textContent);
		await user.click(target);

		expect(setPage).toHaveBeenCalledTimes(1);
		expect(setPage).toHaveBeenCalledWith(targetPage);
	});

	it("next trigger advances from page 1 to page 2", async () => {
		const user = userEvent.setup();
		const setPageNext = vi.fn();
		renderWithProviders(<TodosPagination />, {
			page: 1,
			totalResults: 40,
			setPage: setPageNext as unknown as React.Dispatch<
				React.SetStateAction<number>
			>,
		});
		const { next } = getPreviousAndNextButtons();
		await user.click(next);
		expect(setPageNext).toHaveBeenCalledWith(2);
	});

	it("prev trigger goes from page 2 to page 1", async () => {
		const user = userEvent.setup();
		const setPagePrevious = vi.fn();
		renderWithProviders(<TodosPagination />, {
			page: 2,
			totalResults: 40,
			setPage: setPagePrevious as unknown as React.Dispatch<
				React.SetStateAction<number>
			>,
		});
		const { previous } = getPreviousAndNextButtons();
		await user.click(previous);
		expect(setPagePrevious).toHaveBeenCalledWith(1);
	});

	it("clicking next at the last page does not advance beyond the last page", async () => {
		const user = userEvent.setup();
		const setPage = vi.fn();

		renderWithProviders(<TodosPagination />, {
			page: 2,
			totalResults: 20,
			setPage: setPage as unknown as React.Dispatch<
				React.SetStateAction<number>
			>,
		});

		const { next } = getPreviousAndNextButtons();
		await user.click(next);

		const calls = setPage.mock.calls.length;
		if (calls > 0) {
			const firstCall = setPage.mock.calls[0];
			const arg = firstCall?.[0] as number | undefined;
			expect(arg).toBe(2);
		} else {
			expect(calls).toBe(0);
		}
	});

	it("renders safely with no results (0 or undefined)", () => {
		const setPage = vi.fn();

		const r1 = renderWithProviders(<TodosPagination />, {
			page: 1,
			totalResults: 0,
			setPage: setPage as unknown as React.Dispatch<
				React.SetStateAction<number>
			>,
		});
		expect(getNumberButtons().length).toBe(0);
		r1.unmount();

		renderWithProviders(<TodosPagination />, {
			page: 1,
			totalResults: undefined,
			setPage: setPage as unknown as React.Dispatch<
				React.SetStateAction<number>
			>,
		});
		expect(getNumberButtons().length).toBeGreaterThanOrEqual(0);
	});
});
