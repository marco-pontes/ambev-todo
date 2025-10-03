import { screen } from "@testing-library/react";
import { PageHeader } from "./page-header.tsx";
import { render } from "@/test-utils/render.tsx";

describe("PageHeader Component", () => {
	it("should render the page header title", () => {
		render(<PageHeader />);

		const link = screen.getByRole("heading", {
			name: /Gerenciador de Tarefas/i,
		});
		expect(link).toBeInTheDocument();
	});
});
