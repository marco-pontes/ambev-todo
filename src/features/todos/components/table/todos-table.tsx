import { Table as ChakraTable } from "@chakra-ui/react";
import type { FunctionComponent } from "@/types/types.ts";
import { useApplicationContext } from "@/context/ApplicationContext.tsx";
import type { Dispatch, SetStateAction } from "react";
import type { Todo } from "@/features/todos/types/todo.ts";
import { TodosTableBody } from "@/features/todos/components/table/body";
import { TodosTableHeader } from "@/features/todos/components/table/header";

export type TableComponentsProps = {
	selection: Array<number>;
	todos: Array<Todo>;
	setSelection: Dispatch<SetStateAction<Array<number>>>;
};

export const TodosTable = (): FunctionComponent => {
	const { selection, todos, setSelection } = useApplicationContext();

	return (
		<ChakraTable.Root>
			<TodosTableHeader
				selection={selection}
				setSelection={setSelection}
				todos={todos || []}
			/>

			<TodosTableBody
				selection={selection}
				setSelection={setSelection}
				todos={todos || []}
			></TodosTableBody>
		</ChakraTable.Root>
	);
};
