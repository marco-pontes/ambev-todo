import { useTranslation } from "react-i18next";
import type { FunctionComponent } from "../types/types.ts";
import { MainLayout } from "@/components/layout/main-layout";
import { Box, Heading, SkeletonText, VStack, Center } from "@chakra-ui/react";
import { TodosTable } from "@/features/todos/components/table";
import { useApplicationContext } from "@/context/ApplicationContext.tsx";
import { TodosPagination } from "@/features/todos/components/pagination/todos-pagination.tsx";
import { TodosDialog } from "@/features/todos/components/dialog";
import { TodosActionBar } from "@/features/todos/components/action-bar/todos-action-bar.tsx";
export const Home = (): FunctionComponent => {
	const { t } = useTranslation("translations");
	const { todos } = useApplicationContext();

	return (
		<MainLayout>
			<Heading letterSpacing="tight" padding="6" size="xl">
				{t("home.header")}
			</Heading>
			<VStack>
				<Box padding="4" width="100%">
					{!todos && <SkeletonText height="20px" noOfLines={25} width="full" />}
					{todos && <TodosTable />}
					<Center padding="4" width="100%">
						{todos && <TodosPagination />}
					</Center>
				</Box>
				<TodosDialog />
				<TodosActionBar />
			</VStack>
		</MainLayout>
	);
};
