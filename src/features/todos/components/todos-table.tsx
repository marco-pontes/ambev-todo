import { Checkbox, Table as ChakraTable } from "@chakra-ui/react";
import type { FunctionComponent } from "@/types/types.ts";
import { useApplicationContext } from "@/context/ApplicationContext.tsx";
import { TableMenu } from "@/features/todos/components/table-menu.tsx";
import type { Dispatch, SetStateAction } from "react";
import type { Todo } from "@/features/todos/types/todo.ts";

type TableComponentsProps = {
	selection: Array<number>;
	todos: Array<Todo>;
	setSelection: Dispatch<SetStateAction<Array<number>>>;
};
const TableHeader = ({
	selection,
	todos,
	setSelection,
}: TableComponentsProps) => {
	const hasSelection = selection.length > 0;
	const indeterminate =
		todos && hasSelection && selection.length < todos.length;
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
				<ChakraTable.ColumnHeader>Product</ChakraTable.ColumnHeader>
				<ChakraTable.ColumnHeader>Category</ChakraTable.ColumnHeader>
				<ChakraTable.ColumnHeader>Price</ChakraTable.ColumnHeader>
				<ChakraTable.ColumnHeader w="8">Ações</ChakraTable.ColumnHeader>
			</ChakraTable.Row>
		</ChakraTable.Header>
	);
};

const TableBody = ({
	selection,
	todos,
	setSelection,
}: TableComponentsProps) => {
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
					<ChakraTable.Cell>{todo.status}</ChakraTable.Cell>
					<ChakraTable.Cell>
						<TableMenu todo={todo} />
					</ChakraTable.Cell>
				</ChakraTable.Row>
			))}
		</ChakraTable.Body>
	);
};

export const TodosTable = (): FunctionComponent => {
	const { selection, todos, setSelection } = useApplicationContext();

	return (
		<ChakraTable.Root>
			<TableHeader
				selection={selection}
				setSelection={setSelection}
				todos={todos || []}
			/>

			<TableBody
				selection={selection}
				setSelection={setSelection}
				todos={todos || []}
			></TableBody>
		</ChakraTable.Root>
	);
};
