import { screen } from "@testing-library/react";
import { NavBar } from "./navbar";
import { render } from "@/test-utils/render.tsx";

describe("Navbar Component", () => {
	it("should render the menu links", () => {
		render(<NavBar />);

		expect(screen.getByRole("link", { name: /Início/i })).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /Criar Tarefa/i })
		).toBeInTheDocument();
	});
});
