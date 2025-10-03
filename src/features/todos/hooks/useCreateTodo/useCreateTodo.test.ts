import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCreateTodo } from "./useCreateTodo.ts";
import type { Todo } from "@/features/todos/types/todo.ts";
import { API_ENDPOINTS } from "@/common/constants.ts";

const post = vi.fn();
vi.mock(
	"@/common/http-client.ts",
	(): Record<string, unknown> => ({
		httpClient: () => ({ post }),
	})
);

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

function createWrapper(): ({
	children,
}: {
	children: React.ReactNode;
}) => React.ReactElement {
	const client = new QueryClient();
	return ({ children }: { children: React.ReactNode }) =>
		React.createElement(
			QueryClientProvider,
			{ client },
			children as React.ReactElement
		);
}

describe("useCreateTodo", () => {
	const wrapper = createWrapper();

	beforeEach(() => {
		post.mockReset();
	});

	afterAll(() => {
		consoleErrorSpy.mockRestore();
	});

	it("calls POST to CREATE_TODO and invokes success callback after invalidating todos", async () => {
		const success = vi.fn();
		post.mockResolvedValueOnce(new Response(null, { status: 201 }));

		const { result } = renderHook(() => useCreateTodo(success), { wrapper });

		const payload: Partial<Todo> = {
			title: "New",
			description: "D",
		} as Partial<Todo>;

		result.current.mutate(payload);

		await waitFor(() => {
			expect(result.current.isPending).toBe(false);
		});

		expect(post).toHaveBeenCalledWith(API_ENDPOINTS.CREATE_TODO, payload);
		expect(success).toHaveBeenCalledTimes(1);
	});

	it("logs error on failure and does not call success callback", async () => {
		const success = vi.fn();
		post.mockRejectedValueOnce(new Error("boom"));

		const { result } = renderHook(() => useCreateTodo(success), { wrapper });

		result.current.mutate({ title: "X" });

		await waitFor(() => {
			expect(result.current.isPending).toBe(false);
		});

		expect(success).not.toHaveBeenCalled();
		expect(consoleErrorSpy).toHaveBeenCalled();
	});
});
