import { screen } from "@testing-library/react";
import { render } from "@/test-utils/render.tsx";
import { MainLayout } from "./MainLayout.tsx";
import { AlertType } from "@/types/types.ts";
import type { JSX } from "react";

// Mock Chakra's ClientOnly to render children immediately for deterministic tests
vi.mock(
  "@chakra-ui/react",
  async (importOriginal): Promise<Record<string, unknown>> => {
    const originalModule: Record<string, unknown> = await importOriginal();
    return {
      ...originalModule,
      ClientOnly: ({ children }: { children: React.ReactNode }): JSX.Element => (
        <>{children}</>
      ),
    } as Record<string, unknown>;
  }
);

// Mock ApplicationContext to control `message`
vi.mock("@/context/ApplicationContext.tsx", () => {
  return {
    useApplicationContext: (): { message: null } => ({
      // only what MainLayout uses
      message: null,
    }),
  };
});

describe("MainLayout", () => {
  it("renders the PageHeader and children", () => {
    render(
      <MainLayout>
        <div data-testid="child">Hello child</div>
      </MainLayout>
    );

    // PageHeader contains the app title translated (pt-BR default)
    expect(
      screen.getByRole("heading", { name: /gerenciador de tarefas/i })
    ).toBeInTheDocument();

    // children should be rendered
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders Alert when context message is present", async () => {
    // Update the existing mock implementation at runtime
    const contextModule = await import("@/context/ApplicationContext.tsx");
    vi.spyOn(contextModule, "useApplicationContext").mockReturnValue({
      message: { type: AlertType.success, message: "Tudo certo" },
    } as unknown as ReturnType<typeof contextModule.useApplicationContext>);

    const { container } = render(
      <MainLayout>
        <div />
      </MainLayout>
    );

    // Alert title text should appear
    expect(screen.getByText(/tudo certo/i)).toBeInTheDocument();

    // And Chakra alert root should exist
    const root = container.querySelector(".chakra-alert__root");
    expect(root).toBeTruthy();
  });

  it("renders the ColorModeButton (toggle color mode)", () => {
    render(
      <MainLayout>
        <div />
      </MainLayout>
    );

    const button = screen.getByRole("button", { name: /toggle color mode/i });
    expect(button).toBeInTheDocument();
  });
});
