import type { FunctionComponent } from "@/types/types.ts";
import { Checkbox, Table as ChakraTable } from "@chakra-ui/react";
import type { TableComponentsProps } from "@/features/todos/components/table/todos-table.tsx";
import { useTranslation } from "react-i18next";

export const TodosTableHeader = ({
	selection,
	todos,
	setSelection,
}: TableComponentsProps): FunctionComponent => {
	const hasSelection = selection.length > 0;
	const indeterminate =
		todos && hasSelection && selection.length < todos.length;
	const { t } = useTranslation();
	return (
		<ChakraTable.Header>
			<ChakraTable.Row>
				<ChakraTable.ColumnHeader w="6">
					<Checkbox.Root
						aria-label="Select all rows"
						checked={indeterminate ? "indeterminate" : selection.length > 0}
						size="sm"
						top="0.5"
						onCheckedChange={(changes) => {
							setSelection(changes.checked ? todos.map((todo) => todo.id) : []);
						}}
					>
						<Checkbox.HiddenInput />
						<Checkbox.Control />
					</Checkbox.Root>
				</ChakraTable.ColumnHeader>
				<ChakraTable.ColumnHeader>
					{t("todos.table.header.title")}
				</ChakraTable.ColumnHeader>
				<ChakraTable.ColumnHeader>
					{t("todos.table.header.description")}
				</ChakraTable.ColumnHeader>
				<ChakraTable.ColumnHeader>
					{t("todos.table.header.status")}
				</ChakraTable.ColumnHeader>
				<ChakraTable.ColumnHeader w="8">
					{t("todos.table.header.actions")}
				</ChakraTable.ColumnHeader>
			</ChakraTable.Row>
		</ChakraTable.Header>
	);
};
