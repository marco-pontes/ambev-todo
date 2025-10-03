import type { FunctionComponent } from "@/types/types.ts";
import { useApplicationContext } from "@/context/ApplicationContext.tsx";
import { CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { TodosForm } from "@/features/todos/components/form/todos-form.tsx";
import type { Todo } from "@/features/todos/types/todo.ts";
import { useTranslation } from "react-i18next";

export const TodosDialog = (): FunctionComponent => {
	const {
		handleUpdateTodo,
		activeEditTodo,
		editModalOpen,
		setEditModalOpen,
		isPending,
	} = useApplicationContext();
	const { t } = useTranslation();

	const handleSubmitTodo = (todo: Partial<Todo>): void => {
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
							<Dialog.Title>{t("todos.edit.dialog.title")}</Dialog.Title>
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
