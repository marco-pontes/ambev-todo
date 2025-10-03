import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUpdateTodo } from "./useUpdateTodo.ts";
import type { Todo } from "@/features/todos/types/todo.ts";
import { API_ENDPOINTS } from "@/common/constants.ts";

// Mock httpClient to control network calls
const patch = vi.fn();
vi.mock("@/common/http-client.ts", (): Record<string, unknown> => ({
  httpClient: () => ({ patch }),
}));

// Spy on console.error to suppress noisy logs in error test
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

function createWrapper(): ({ children }: { children: React.ReactNode }) => React.ReactElement {
  const client = new QueryClient();
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client }, children as React.ReactElement);
}

describe("useUpdateTodo", () => {
  const wrapper = createWrapper();

  beforeEach(() => {
    patch.mockReset();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("calls PATCH to UPDATE_TODO(id) and invokes success callback after invalidating todos", async () => {
    const success = vi.fn();
    patch.mockResolvedValueOnce(new Response(null, { status: 200 }));

    const { result } = renderHook(() => useUpdateTodo(success), { wrapper });

    const payload: Partial<Todo> = { id: 7, title: "Updated", description: "D" } as Partial<Todo>;

    result.current.mutate(payload);

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(patch).toHaveBeenCalledWith(API_ENDPOINTS.UPDATE_TODO(payload.id!), payload);
    expect(success).toHaveBeenCalledTimes(1);
  });

  it("logs error on failure and does not call success callback", async () => {
    const success = vi.fn();
    patch.mockRejectedValueOnce(new Error("boom"));

    const { result } = renderHook(() => useUpdateTodo(success), { wrapper });

    result.current.mutate({ id: 1, title: "X" });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(success).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
