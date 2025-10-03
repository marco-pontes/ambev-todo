import { createServer, Response } from "miragejs";
import { Todo, TodoStatus } from "@/features/todos/types/todo.ts";

function seedTodos(): Todo[] {
	const items: Todo[] = [];
	for (let i = 1; i <= 20; i++) {
		items.push({
			id: 10000 + i,
			title: `Task ${i}`,
			description: `This is a sample description for task ${i}.`,
			status: (i % 3 === 0 ? "COMPLETED" : "PENDING") as TodoStatus,
		});
	}
	return items;
}

let todos: Todo[] = seedTodos();

type MakeServerOptions = { environment?: string };
export function makeServer({
	environment = "development",
}: MakeServerOptions = {}) {
	const server = createServer({
		environment,
		urlPrefix: "http://localhost:5000",
		namespace: "/v1",

		routes: function () {
			this.get("/todos", (_schema, request) => {
				const page = parseInt(
					(request.queryParams["page"] as string) || "1",
					10
				);
				const limit = parseInt(
					(request.queryParams["limit"] as string) || "10",
					10
				);
				const startIndex = (page - 1) * limit;
				const endIndex = startIndex + limit;
				const paginated = todos.slice(startIndex, endIndex);

				const headers: Record<string, string> = {
					"X-Total-Count": String(todos.length),
					"Access-Control-Expose-Headers": "X-Total-Count",
				};
				return new Response(200, headers, paginated);
			});

			this.post("/todos", (_schema, request) => {
				try {
					const body = JSON.parse(request.requestBody || "{}");
					const { status, title, description } = body as Partial<Todo>;

					if (
						typeof status !== "string" ||
						status.trim() === "" ||
						typeof title !== "string" ||
						title.trim() === ""
					) {
						return new Response(
							400,
							{},
							{
								error:
									"A propriedade newStatus é obrigatória e deve ser uma string.",
							}
						);
					}

					const min = 10000;
					const max = 100000;
					const id = Math.floor(Math.random() * (max - min + 1)) + min;
					const newTodo: Todo = {
						id,
						status: (status as TodoStatus) ?? ("PENDING" as TodoStatus),
						title: title,
						description: description ?? "",
					};
					todos.push(newTodo);
					return new Response(200, {}, newTodo);
				} catch {
					return new Response(400, {}, { error: "Invalid JSON body" });
				}
			});

			this.patch("/todos/:id", (_schema, request) => {
				const id = parseInt(request.params["id"] || "", 10);
				try {
					const body = JSON.parse(request.requestBody || "{}");
					const { status, title, description } = body as Partial<Todo>;

					if (typeof status !== "string" || status.trim() === "") {
						return new Response(
							400,
							{},
							{
								error:
									"A propriedade newStatus é obrigatória e deve ser uma string.",
							}
						);
					}

					const idx = todos.findIndex((t) => t.id === id);
					if (idx === -1) {
						return new Response(
							404,
							{},
							{ error: `Todo with id ${id} not found` }
						);
					}

					const existing = todos[idx];
					todos[idx] = {
						id: existing!.id,
						status: status as TodoStatus,
						title: title ?? existing!.title,
						description: description ?? existing!.description,
					};

					return new Response(200, {}, todos);
				} catch {
					return new Response(400, {}, { error: "Invalid JSON body" });
				}
			});

			this.delete("/todos/:id", (_schema, request) => {
				const id = parseInt(request.params["id"] || "", 10);
				const idx = todos.findIndex((t) => t.id === id);
				if (idx > -1) {
					todos.splice(idx, 1);
				}
				if (idx === -1) {
					return new Response(
						404,
						{},
						{ error: `Todo with id ${id} not found` }
					);
				}
				return new Response(200, {}, todos);
			});
		},
	});

	return server;
}
