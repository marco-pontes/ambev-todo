import {
	createContext,
	useContext,
	type FunctionComponent,
	type ReactNode,
	useState,
	type Dispatch,
	type SetStateAction,
} from "react";
import { useUpdateTodo } from "@/features/todos/hooks/useUpdateTodo.ts";
import type { UseMutateFunction } from "@tanstack/react-query";
import type { Todo, UpdateTodoVariables } from "@/features/todos/types/todo.ts";
import { useTodoList } from "@/features/todos/hooks/useTodoList.ts";
import { useDeleteTodo } from "@/features/todos/hooks/useDeleteTodo.ts";
import { useCreateTodo } from "@/features/todos/hooks/useCreateTodo.ts";

type ApplicationContextType = {
	mutateUpdate: UseMutateFunction<Response, Error, UpdateTodoVariables>;
	mutateCreate: UseMutateFunction<Response, Error, UpdateTodoVariables>;
	mutateDelete: UseMutateFunction<Response, Error, number>;
	isPending: boolean;
	isPendingCreate: boolean;
	editModalOpen: boolean;
	setEditModalOpen: Dispatch<SetStateAction<boolean>>;
	setActiveEditTodo: Dispatch<SetStateAction<UpdateTodoVariables | undefined>>;
	activeEditTodo: UpdateTodoVariables | undefined;
	handleUpdateTodo: (todo: UpdateTodoVariables) => void;
	handleEditTodo: (todo: Todo) => void;
	hasError: boolean;
	errorMessage: string | undefined;
	todos: Array<Todo> | undefined;
	isLoadingTodos: boolean;
	selection: Array<number>;
	setSelection: Dispatch<SetStateAction<Array<number>>>;
	page: number;
	setPage: Dispatch<SetStateAction<number>>;
	totalResults: number | undefined;
};

const ApplicationContext = createContext<ApplicationContextType | undefined>(
	undefined
);

type ApplicationProviderProps = {
	children: ReactNode;
};

export const ApplicationProvider: FunctionComponent<
	ApplicationProviderProps
> = ({ children }) => {
	const { mutate: mutateUpdate, isPending: isPendingUpdate } = useUpdateTodo();
	const { mutate: mutateCreate, isPending: isPendingCreate } = useCreateTodo();
	const { mutate: mutateDelete, isPending: isPendingDelete } = useDeleteTodo();

	const [page, setPage] = useState<number>(1);
	const [activeEditTodo, setActiveEditTodo] = useState<UpdateTodoVariables>();
	const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
	const {
		data,
		isLoading: isLoadingTodos,
		isError: isErrorLoadingTodos,
		error: loadTodosError,
	} = useTodoList(page);
	const [selection, setSelection] = useState<Array<number>>([]);

	const isPending = isPendingUpdate || isPendingDelete || isLoadingTodos;

	const hasError = isErrorLoadingTodos;
	const errorMessage = loadTodosError?.message;

	const handleUpdateTodo = (todo: UpdateTodoVariables): void => {
		mutateUpdate(todo);
		setEditModalOpen(false);
	};

	const handleEditTodo = (todo: Todo): void => {
		setActiveEditTodo({ ...todo });
		setEditModalOpen(true);
	};

	const contextValue = {
		page,
		setPage,
		activeEditTodo,
		setActiveEditTodo,
		editModalOpen,
		setEditModalOpen,
		todos: data?.todos,
		totalResults: data?.totalResults,
		errorMessage,
		selection,
		setSelection,
		handleUpdateTodo,
		handleEditTodo,
		mutateUpdate,
		mutateDelete,
		mutateCreate,
		hasError,
		isPending,
		isPendingCreate,
		isLoadingTodos,
	};

	return (
		<ApplicationContext.Provider value={contextValue}>
			{children}
		</ApplicationContext.Provider>
	);
};

export const useApplicationContext = (): ApplicationContextType => {
	const context = useContext(ApplicationContext);
	if (context === undefined) {
		throw new Error(
			"useApplicationContext must be used within an ApplicationProvider"
		);
	}
	return context;
};
