import { Flex, HStack, Link } from "@chakra-ui/react";
import type { FunctionComponent } from "@/types/types.ts";
import { useTranslation } from "react-i18next";

export const NavBar = (): FunctionComponent => {
	const { t } = useTranslation("translations");
	return (
		<Flex
			alignItems={"center"}
			h={"20"}
			justifyContent={"space-between"}
			p={"10"}
		>
			<HStack display={{ sm: "flex", md: "flex" }}>
				<Link colorPalette="teal" href={"/"} p={5} variant="plain">
					{t("app.navbar.home")}
				</Link>
				<Link colorPalette="teal" href={"/create"} p={5} variant="plain">
					{t("app.navbar.create")}
				</Link>
			</HStack>
		</Flex>
	);
};
