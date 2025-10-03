import { Checkbox, Table as ChakraTable } from "@chakra-ui/react";
import { TodosMenu } from "@/features/todos/components/table/menu/todos-menu.tsx";
import type { TableComponentsProps } from "@/features/todos/components/table/todos-table.tsx";
import type { FunctionComponent } from "@/types/types.ts";
import { useTranslation } from "react-i18next";

export const TodosTableBody = ({
	selection,
	todos,
	setSelection,
}: TableComponentsProps): FunctionComponent => {
	const { t } = useTranslation();
	return (
		<ChakraTable.Body>
			{todos?.map((todo) => (
				<ChakraTable.Row
					key={todo.title}
					data-selected={selection.includes(todo.id) ? "" : undefined}
				>
					<ChakraTable.Cell>
						<Checkbox.Root
							aria-label="Select row"
							checked={selection.includes(todo.id)}
							size="sm"
							top="0.5"
							onCheckedChange={(changes) => {
								setSelection((previous) =>
									changes.checked
										? [...previous, todo.id]
										: selection?.filter((id) => id !== todo.id)
								);
							}}
						>
							<Checkbox.HiddenInput />
							<Checkbox.Control />
						</Checkbox.Root>
					</ChakraTable.Cell>
					<ChakraTable.Cell>{todo.title}</ChakraTable.Cell>
					<ChakraTable.Cell>{todo.description}</ChakraTable.Cell>
					<ChakraTable.Cell>
						{t(`todos.enums.status.${todo.status}`)}
					</ChakraTable.Cell>
					<ChakraTable.Cell>
						<TodosMenu todo={todo} />
					</ChakraTable.Cell>
				</ChakraTable.Row>
			))}
		</ChakraTable.Body>
	);
};
