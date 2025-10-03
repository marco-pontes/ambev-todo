import { screen, render as rtlRender } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import {
  ApplicationProvider,
  useApplicationContext,
} from "@/context/ApplicationContext.tsx";
import type { Todo } from "@/features/todos/types/todo.ts";
import { AlertType } from "@/types/types.ts";
import { vi } from "vitest";

// Mocks for external hooks used inside the provider
const mutateUpdate = vi.fn();
const mutateCreate = vi.fn();
const mutateDelete = vi.fn();

vi.mock("@/features/todos/hooks/useUpdateTodo.ts", () => ({
  useUpdateTodo: () => ({ mutate: mutateUpdate, isPending: false }),
}));

vi.mock("@/features/todos/hooks/useCreateTodo.ts", () => ({
  useCreateTodo: () => ({ mutate: mutateCreate, isPending: false }),
}));

vi.mock("@/features/todos/hooks/useDeleteTodo.ts", () => ({
  useDeleteTodo: () => ({ mutate: mutateDelete, isPending: false }),
}));

vi.mock("@/features/todos/hooks/useTodoList.ts", () => ({
  useTodoList: (page: number) => ({
    data: { todos: [], totalResults: 0, page },
    isLoading: false,
    isError: false,
  }),
}));

vi.mock("react-i18next", async () => {
  const actual: Record<string, unknown> = await vi.importActual("react-i18next");
  return {
    ...actual,
    useTranslation: () => ({ t: (key: string) => (key === "todos.updated" ? "Todo updated" : key) }),
  } as Record<string, unknown>;
});

function renderWithProvider(ui: React.ReactNode) {
  return rtlRender(<ApplicationProvider>{ui}</ApplicationProvider>);
}

function Consumer() {
  const ctx = useApplicationContext();
  return (
    <div>
      <div data-testid="page">{ctx.page}</div>
      <div data-testid="selection">{ctx.selection.join(",")}</div>
      <div data-testid="editModalOpen">{String(ctx.editModalOpen)}</div>
      <div data-testid="message">{ctx.message ? ctx.message.message : ""}</div>
      <button onClick={() => ctx.setPage(3)}>setPage3</button>
      <button onClick={() => ctx.setSelection([1, 2])}>setSelection12</button>
      <button onClick={() => ctx.addMessage({ type: AlertType.success, message: "Hi" }, 10)}>addMsg</button>
      <button
        onClick={() =>
          ctx.handleEditTodo({ id: 123, title: "a", completed: false, userId: 1 } as unknown as Todo)
        }
      >
        editTodo
      </button>
      <button onClick={() => ctx.handleUpdateTodo({ id: 1, title: "x" })}>updateTodo</button>
    </div>
  );
}

describe("ApplicationContext", () => {
  it("throws when used outside provider", () => {
    // Suppress expected error logs for this test
    const origError = console.error;
    console.error = () => {};
    const Thrower = () => {
      useApplicationContext();
      return null;
    };
    expect(() => rtlRender(<Thrower />)).toThrowError(
      /useApplicationContext must be used within an ApplicationProvider/i
    );
    console.error = origError;
  });

  it("provides default values and allows state updates", async () => {
    const user = userEvent.setup();
    renderWithProvider(<Consumer />);

    expect(screen.getByTestId("page")).toHaveTextContent("1");
    expect(screen.getByTestId("selection")).toHaveTextContent("");
    expect(screen.getByTestId("editModalOpen")).toHaveTextContent("false");

    await user.click(screen.getByText("setPage3"));
    expect(screen.getByTestId("page")).toHaveTextContent("3");

    await user.click(screen.getByText("setSelection12"));
    expect(screen.getByTestId("selection")).toHaveTextContent("1,2");
  });

  it("handleEditTodo opens modal and sets active todo", async () => {
    const user = userEvent.setup();
    renderWithProvider(<Consumer />);

    // initially false
    expect(screen.getByTestId("editModalOpen")).toHaveTextContent("false");

    await user.click(screen.getByText("editTodo"));

    expect(screen.getByTestId("editModalOpen")).toHaveTextContent("true");
  });

  it("addMessage sets message and auto clears after duration", async () => {
    vi.useFakeTimers();

    function Trigger() {
      const ctx = useApplicationContext();
      React.useEffect(() => {
        ctx.addMessage({ type: AlertType.success, message: "Hi" }, 10);
      }, []);
      return <Consumer />;
    }

    renderWithProvider(<Trigger />);

    // immediately set
    expect(screen.getByTestId("message")).toHaveTextContent("Hi");

    // advance timers to fire timeout
    await Promise.resolve();
    // Using act to flush timers
    await (await import("react-dom/test-utils")).act(async () => {
      vi.advanceTimersByTime(10);
    });

    expect(screen.getByTestId("message")).toHaveTextContent("");

    vi.useRealTimers();
  });

  it("handleUpdateTodo calls mutateUpdate, closes modal and sets success message", async () => {
    vi.useFakeTimers();

    function TriggerUpdate() {
      const context = useApplicationContext();
      return (
        <div>
          <button onClick={() => context.handleEditTodo({ id: 2 } as unknown as Todo)}>open</button>
          <button onClick={() => context.handleUpdateTodo({ id: 1, title: "x" })}>update</button>
          <Consumer />
        </div>
      );
    }

    const user = userEvent.setup();
    renderWithProvider(<TriggerUpdate />);

    await user.click(screen.getByText("open"));
    expect(screen.getByTestId("editModalOpen")).toHaveTextContent("true");

    await user.click(screen.getByText("update"));

    expect(mutateUpdate).toHaveBeenCalledWith({ id: 1, title: "x" });
    expect(screen.getByTestId("message")).toHaveTextContent("Todo updated");
    expect(screen.getByTestId("editModalOpen")).toHaveTextContent("false");

    vi.useRealTimers();
  });
});
