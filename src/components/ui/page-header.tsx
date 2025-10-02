import type { FunctionComponent } from "@/types/types.ts";
import { useTranslation } from "react-i18next";
import { Box, Center, GridItem, Heading, SimpleGrid } from "@chakra-ui/react";
import { NavBar } from "@/components/ui/navbar.tsx";

export const PageHeader = (): FunctionComponent => {
	const { t } = useTranslation("translations");
	return (
		<>
			<SimpleGrid columns={{ base: 12, md: 12 }}>
				<GridItem colSpan={{ base: 12, md: 12 }}>
					<Center bg="bg.subtle" h="100px">
						<Heading letterSpacing="tight" size="2xl">
							{t("app.header")}
						</Heading>
					</Center>
				</GridItem>
			</SimpleGrid>
			<Box bg="bg.emphasized" height="80px" position="relative" width="full">
				<SimpleGrid columns={{ base: 12, md: 12 }}>
					<GridItem colSpan={{ base: 12, md: 12 }}>
						<NavBar></NavBar>
					</GridItem>
				</SimpleGrid>
			</Box>
		</>
	);
};
