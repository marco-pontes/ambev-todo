import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDeleteTodo } from "./useDeleteTodo.ts";
import { API_ENDPOINTS } from "@/common/constants.ts";

const del = vi.fn();
vi.mock(
	"@/common/http-client.ts",
	(): Record<string, unknown> => ({
		httpClient: () => ({ delete: del }),
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

describe("useDeleteTodo", () => {
	const wrapper = createWrapper();

	beforeEach(() => {
		del.mockReset();
	});

	afterAll(() => {
		consoleErrorSpy.mockRestore();
	});

	it("calls DELETE to DELETE_TODO and invokes success callback after invalidating todos", async () => {
		const success = vi.fn();
		del.mockResolvedValueOnce(new Response(null, { status: 200 }));

		const { result } = renderHook(() => useDeleteTodo(success), { wrapper });

		const id = 123;
		result.current.mutate(id);

		await waitFor(() => {
			expect(result.current.isPending).toBe(false);
		});

		expect(del).toHaveBeenCalledWith(API_ENDPOINTS.DELETE_TODO(id));
		expect(success).toHaveBeenCalledTimes(1);
	});

	it("logs error on failure and does not call success callback", async () => {
		const success = vi.fn();
		del.mockRejectedValueOnce(new Error("boom"));

		const { result } = renderHook(() => useDeleteTodo(success), { wrapper });

		result.current.mutate(5);

		await waitFor(() => {
			expect(result.current.isPending).toBe(false);
		});

		expect(success).not.toHaveBeenCalled();
		expect(consoleErrorSpy).toHaveBeenCalled();
	});
});
