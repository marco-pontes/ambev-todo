import { API_ENDPOINTS, QUERY_KEYS } from "@/common/constants.ts";
import {
	type UseMutationResult,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { httpClient } from "@/common/http-client.ts";
import type { Todo } from "@/features/todos/types/todo.ts";

const updateTodo = async (variables: Partial<Todo>): Promise<Response> => {
	const client = httpClient();
	return client.patch(API_ENDPOINTS.UPDATE_TODO(variables.id!), variables);
};

export const useUpdateTodo = (
	successFn: () => void
): UseMutationResult<Response, Error, Partial<Todo>> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateTodo,
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
