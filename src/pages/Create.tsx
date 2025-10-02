import type { FunctionComponent } from "../types/types.ts";
import { MainLayout } from "../components/layout/MainLayout.tsx";
import { useTranslation } from "react-i18next";
import {
	Box,
	Center,
	GridItem,
	Heading,
	SimpleGrid,
	VStack,
} from "@chakra-ui/react";
import { TodosForm } from "@/features/todos/components/todos-form.tsx";
import type { UpdateTodoVariables } from "@/features/todos/types/todo.ts";
import { useApplicationContext } from "@/context/ApplicationContext.tsx";

export const Create = (): FunctionComponent => {
	const { t } = useTranslation("translations");
	const { mutateCreate, isPendingCreate } = useApplicationContext();

	const handleSubmitTodo = (todo: UpdateTodoVariables): void => {
		mutateCreate(todo);
	};

	return (
		<MainLayout>
			<SimpleGrid columns={{ base: 12, md: 12 }}>
				<GridItem colSpan={{ base: 0, sm: 0, md: 2 }}></GridItem>
				<GridItem colSpan={{ base: 12, sm: 12, md: 8 }}>
					<Center>
						<Heading letterSpacing="tight" padding="6" size="xl">
							{t("create.header")}
						</Heading>
					</Center>
					<VStack>
						<Box padding="4" width="100%">
							<TodosForm
								submitDisabled={isPendingCreate}
								onSubmitTodo={handleSubmitTodo}
							/>
						</Box>
					</VStack>
				</GridItem>
				<GridItem colSpan={{ base: 0, sm: 0, md: 2 }}></GridItem>
			</SimpleGrid>
		</MainLayout>
	);
};
