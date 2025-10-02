import { API_ENDPOINTS, QUERY_KEYS } from "@/common/constants.ts";
import {
	type UseMutationResult,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { httpClient } from "@/common/http-client.ts";
import type { UpdateTodoVariables } from "@/features/todos/types/todo.ts";

const updateTodo = async (
	variables: UpdateTodoVariables
): Promise<Response> => {
	const client = httpClient();
	return client.patch(API_ENDPOINTS.UPDATE_TODO(variables.id!), variables);
};

export const useUpdateTodo = (): UseMutationResult<
	Response,
	Error,
	UpdateTodoVariables
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateTodo,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] });
		},
		onError: (error) => {
			console.error("Erro ao completar o todo:", error);
		},
	});
};
