import type { FunctionComponent } from "@/types/types.ts";
import { useApplicationContext } from "@/context/ApplicationContext.tsx";
import { CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { TodosForm } from "@/features/todos/components/todos-form.tsx";
import type { UpdateTodoVariables } from "@/features/todos/types/todo.ts";

export const TodosDialog = (): FunctionComponent => {
	const {
		handleUpdateTodo,
		activeEditTodo,
		editModalOpen,
		setEditModalOpen,
		isPending,
	} = useApplicationContext();

	const handleSubmitTodo = (todo: UpdateTodoVariables): void => {
		setEditModalOpen(false);
		handleUpdateTodo(todo);
	};

	return (
		<Dialog.Root
			open={editModalOpen}
			size={"lg"}
			onOpenChange={(details) => {
				setEditModalOpen(details.open);
			}}
		>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Edit To-Do</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<TodosForm
								{...activeEditTodo}
								submitDisabled={isPending}
								onSubmitTodo={handleSubmitTodo}
							/>
						</Dialog.Body>
						<Dialog.CloseTrigger asChild>
							<CloseButton size="sm" />
						</Dialog.CloseTrigger>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};
