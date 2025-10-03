import { API_ENDPOINTS, QUERY_KEYS } from "@/common/constants.ts";
import {
	type UseMutationResult,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { httpClient } from "@/common/http-client.ts";
import type { Todo } from "@/features/todos/types/todo.ts";

const createTodo = async (variables: Partial<Todo>): Promise<Response> => {
	const client = httpClient();
	return client.post(API_ENDPOINTS.CREATE_TODO, variables);
};

export const useCreateTodo = (
	successFn: () => void
): UseMutationResult<Response, Error, Partial<Todo>> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createTodo,
		onSuccess: async () => {
			await queryClient
				.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] })
				.then(successFn);
		},
		onError: (error) => {
			console.error("Erro ao completar o todo:", error);
		},
	});
};
