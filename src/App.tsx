import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import type { FunctionComponent } from "./types/types.ts";
import type { TanstackRouter } from "./main";
import { TanStackRouterDevelopmentTools } from "./components/utils/development-tools/TanStackRouterDevelopmentTools";
import { ApplicationProvider } from "./context/ApplicationContext";
import { theme } from "@/components/ui/theme.ts";
import { ColorModeProvider } from "@/components/ui/color-mode.tsx";

const queryClient = new QueryClient();

type AppProps = { router: TanstackRouter };

const App = ({ router }: AppProps): FunctionComponent => {
	return (
		<QueryClientProvider client={queryClient}>
			<ApplicationProvider>
				<ChakraProvider value={theme}>
					<ColorModeProvider>
						<RouterProvider router={router} />
						<TanStackRouterDevelopmentTools
							initialIsOpen={false}
							position="bottom-left"
							router={router}
						/>
						<ReactQueryDevtools initialIsOpen={false} position="bottom" />
					</ColorModeProvider>
				</ChakraProvider>
			</ApplicationProvider>
		</QueryClientProvider>
	);
};

export default App;
