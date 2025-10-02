import { z } from "zod";
import { TodoStatus } from "@/features/todos/types/todo.ts";

export const todoSchema = z.object({
	id: z.number().optional(),
	title: z
		.string()
		.min(1, "O título é obrigatório.")
		.max(100, "O título deve ter no máximo 100 caracteres."),
	description: z
		.string()
		.max(300, "A descrição deve ter no máximo 300 caracteres.")
		.optional(),
	status: z
		.enum([TodoStatus.PENDING, TodoStatus.COMPLETED], {
			error: "O status é obrigatório.",
		})
		.default(TodoStatus.PENDING)
		.nonoptional(),
});

export type TodoFormValues = z.infer<typeof todoSchema>;
