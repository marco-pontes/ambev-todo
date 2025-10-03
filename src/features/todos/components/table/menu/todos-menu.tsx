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
				aria-label="Edit todo"
				className="edit-todo"
				disabled={isPending}
				onClick={() => {
					handleEditTodo(todo);
				}}
			>
				<FaFileSignature />
			</IconButton>
			{todo.status === TodoStatus.PENDING && (
				<IconButton
					aria-label="Complete todo"
					bg="green.focusRing"
					className="complete-todo"
					disabled={isPending}
					onClick={() => {
						handleCompleteTodo(todo.id);
					}}
				>
					<LuCheck color={"green"} />
				</IconButton>
			)}
			{todo.status === TodoStatus.COMPLETED && (
				<IconButton
					aria-label="Set todo pending"
					bg="yellow.focusRing"
					className="pending-todo"
					disabled={isPending}
					onClick={() => {
						handlePendingTodo(todo.id);
					}}
				>
					<FaCirclePause />
				</IconButton>
			)}
			<IconButton
				aria-label="Delete todo"
				bg="red.focusRing"
				className="delete-todo"
				disabled={isPending}
				onClick={() => {
					handleDeleteTodo(todo.id);
				}}
			>
				<LuArchiveX color={"re"} />
			</IconButton>
		</HStack>
	);
};
