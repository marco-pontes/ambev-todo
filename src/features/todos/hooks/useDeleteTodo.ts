import { API_ENDPOINTS, QUERY_KEYS } from "@/common/constants.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/common/http-client.ts";

const completeTodo = async (id: number) => {
	const client = httpClient();
	return client.delete(API_ENDPOINTS.DELETE_TODO(id));
};

export const useDeleteTodo = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: completeTodo,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] });
		},
		onError: (error) => {
			console.error("Erro ao deletar o todo:", error);
		},
	});
};
