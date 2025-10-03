import { API_ENDPOINTS, QUERY_KEYS } from "@/common/constants.ts";
import {
	type UseMutationResult,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { httpClient } from "@/common/http-client.ts";

const completeTodo = async (id: number): Promise<Response> => {
	const client = httpClient();
	return client.delete(API_ENDPOINTS.DELETE_TODO(id));
};

export const useDeleteTodo = (
	successFn: () => void
): UseMutationResult<Response, Error, number> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: completeTodo,
		onSuccess: async () => {
			await queryClient
				.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] })
				.then(successFn);
		},
		onError: (error) => {
			console.error("Erro ao deletar o todo:", error);
		},
	});
};
