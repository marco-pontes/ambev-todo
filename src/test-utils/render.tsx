import { render as rtlRender, type RenderResult } from "@testing-library/react";
import i18n from "./i18n-test.ts";
import { theme } from "@/components/ui/theme.ts";
import { I18nextProvider } from "react-i18next";
import { ChakraProvider } from "@chakra-ui/react";

export function render(ui: React.ReactNode): RenderResult {
	return rtlRender(<>{ui}</>, {
		wrapper: (props: React.PropsWithChildren) => (
			<I18nextProvider i18n={i18n}>
				<ChakraProvider value={theme}>{props.children}</ChakraProvider>
			</I18nextProvider>
		),
	});
}
