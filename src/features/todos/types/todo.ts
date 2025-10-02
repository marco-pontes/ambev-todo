export enum TodoStatus {
	PENDING = "PENDING",
	COMPLETED = "COMPLETED",
}

export type Todo = {
	id: number;
	title: string;
	description: string;
	status: TodoStatus;
};

export type UpdateTodoVariables = {
	id?: number;
	status?: TodoStatus;
	title?: string;
	description?: string;
};

export type FetchResponse = {
	totalResults: number;
	todos: Array<Todo>;
};
