import { type Todo, TodoStatus } from "@/features/todos/types/todo.ts";
import type { FunctionComponent } from "@/types/types.ts";
import { useApplicationContext } from "@/context/ApplicationContext.tsx";
import { HStack, IconButton } from "@chakra-ui/react";
import { FaCirclePause, FaFileSignature } from "react-icons/fa6";
import { LuArchiveX, LuCheck } from "react-icons/lu";

type TableMenuProps = { todo: Todo };
export const TodosMenu = ({ todo }: TableMenuProps): FunctionComponent => {
	const { handleEditTodo, mutateUpdate, mutateDelete, isPending } =
		useApplicationContext();

	const handleCompleteTodo = (id: number): void => {
		mutateUpdate({ id, status: TodoStatus.COMPLETED });
	};

	const handlePendingTodo = (id: number): void => {
		mutateUpdate({ id, status: TodoStatus.PENDING });
	};

	const handleDeleteTodo = (id: number): void => {
		mutateDelete(id);
	};
	return (
		<HStack display={{ sm: "block", md: "flex" }}>
			<IconButton
				disabled={isPending}
				id="edit-todo"
				onClick={() => {
					handleEditTodo(todo);
				}}
			>
				<FaFileSignature />
			</IconButton>
			{todo.status === TodoStatus.PENDING && (
				<IconButton
					bg="green.focusRing"
					disabled={isPending}
					id="complete-todo"
					onClick={() => {
						handleCompleteTodo(todo.id);
					}}
				>
					<LuCheck color={"green"} />
				</IconButton>
			)}
			{todo.status === TodoStatus.COMPLETED && (
				<IconButton
					bg="yellow.focusRing"
					disabled={isPending}
					id="pending-todo"
					onClick={() => {
						handlePendingTodo(todo.id);
					}}
				>
					<FaCirclePause />
				</IconButton>
			)}
			<IconButton
				bg="red.focusRing"
				disabled={isPending}
				id="delete-todo"
				onClick={() => {
					handleDeleteTodo(todo.id);
				}}
			>
				<LuArchiveX color={"re"} />
			</IconButton>
		</HStack>
	);
};
