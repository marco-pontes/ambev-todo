import type { ReactNode } from "react";
import type { FunctionComponent } from "../../types/types.ts";
import {
	Box,
	Center,
	ClientOnly,
	Container,
	Skeleton,
	Text,
} from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode.tsx";
import { useApplicationContext } from "@/context/ApplicationContext.tsx";
import { PageHeader } from "@/components/ui/page-header.tsx";

type MainLayoutProps = {
	children: ReactNode;
};

export const MainLayout = ({
	children,
}: MainLayoutProps): FunctionComponent => {
	const { hasError, errorMessage } = useApplicationContext();
	return (
		<Container>
			<PageHeader />
			{hasError && (
				<Center padding="4" width="100%">
					<Text color="red.500">Error loading: {errorMessage}</Text>
				</Center>
			)}
			{children}
			<Box pos="absolute" right="8" top="8">
				<ClientOnly fallback={<Skeleton h="10" rounded="md" w="10" />}>
					<ClientOnly fallback={<Skeleton h="10" rounded="md" w="10" />}>
						<ColorModeButton />
					</ClientOnly>
				</ClientOnly>
			</Box>
		</Container>
	);
};
