import { API_ENDPOINTS, QUERY_KEYS } from "@/common/constants.ts";
import {
	type UseMutationResult,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { httpClient } from "@/common/http-client.ts";
import type { UpdateTodoVariables } from "@/features/todos/types/todo.ts";

const createTodo = async (
	variables: UpdateTodoVariables
): Promise<Response> => {
	const client = httpClient();
	return client.post(API_ENDPOINTS.CREATE_TODO, variables);
};

export const useCreateTodo = (): UseMutationResult<
	Response,
	Error,
	UpdateTodoVariables
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createTodo,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] });
		},
		onError: (error) => {
			console.error("Erro ao completar o todo:", error);
		},
	});
};
