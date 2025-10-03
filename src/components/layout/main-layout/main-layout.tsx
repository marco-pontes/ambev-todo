import type {
	FunctionComponent,
	MainLayoutProps,
} from "../../../types/types.ts";
import { Box, Center, ClientOnly, Container, Skeleton } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode/color-mode.tsx";
import { useApplicationContext } from "@/context/ApplicationContext.tsx";
import { PageHeader } from "@/components/ui/page-header/page-header.tsx";
import { Alert } from "@/components/ui/alert/alert.tsx";

export const MainLayout = ({
	children,
}: MainLayoutProps): FunctionComponent => {
	const { message } = useApplicationContext();
	return (
		<Container>
			<PageHeader />
			{message && (
				<Center padding="4" width="100%">
					<Alert message={message.message} type={message.type} />
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
