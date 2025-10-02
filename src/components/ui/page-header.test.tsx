import { screen } from "@testing-library/react";
import { NavBar } from "./navbar";
import { render } from "@/test-utils/render.tsx";

describe("Navbar Component", () => {
	it("should render the menu links", async () => {
		render(<NavBar />);

		const link1 = screen.getByRole("link", { name: /Início/i });
		expect(link1).toBeInTheDocument();
		expect(await screen.findByText("Criar Tarefa")).toBeInTheDocument();
	});
});
