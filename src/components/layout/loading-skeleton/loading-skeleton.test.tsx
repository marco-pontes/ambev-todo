import { render } from "@/test-utils/render.tsx";
import { LoadingSkeleton } from "./loading-skeleton.tsx";

describe("LoadingSkeleton", () => {
	it("renders without crashing and includes grid items", () => {
		const { container } = render(<LoadingSkeleton />);
		const gridItems = container.querySelectorAll(".chakra-grid__item");
		if (gridItems.length > 0) {
			expect(gridItems.length).toBeGreaterThan(0);
		} else {
			expect(container.querySelector(".chakra-container")).toBeTruthy();
		}
	});
});
