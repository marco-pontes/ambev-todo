import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/render.tsx";
import { MainLayout } from "./main-layout.tsx";
import { AlertType } from "@/types/types.ts";

describe("MainLayout", () => {
	it("renders the PageHeader and children", () => {
		renderWithProviders(
			<MainLayout>
				<div data-testid="child">Hello child</div>
			</MainLayout>
		);

		expect(
			screen.getByRole("heading", { name: /gerenciador de tarefas/i })
		).toBeInTheDocument();

		expect(screen.getByTestId("child")).toBeInTheDocument();
	});

	it("renders Alert when context message is present", async () => {
		const contextModule = await import("@/context/ApplicationContext.tsx");
		vi.spyOn(contextModule, "useApplicationContext").mockReturnValue({
			message: { type: AlertType.success, message: "Tudo certo" },
		} as unknown as ReturnType<typeof contextModule.useApplicationContext>);

		const { container } = renderWithProviders(
			<MainLayout>
				<div />
			</MainLayout>
		);

		expect(screen.getByText(/tudo certo/i)).toBeInTheDocument();

		const root = container.querySelector(".chakra-alert__root");
		expect(root).toBeTruthy();
	});

	it("renders the ColorModeButton (toggle color mode)", () => {
		renderWithProviders(
			<MainLayout>
				<div />
			</MainLayout>
		);

		const button = screen.getByRole("button", { name: /toggle color mode/i });
		expect(button).toBeInTheDocument();
	});
});
