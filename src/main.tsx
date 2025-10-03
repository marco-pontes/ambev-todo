import { createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { routeTree } from "./routeTree.gen.ts";
import "./common/i18n";
import { LoadingSkeleton } from "@/components/layout/loading-skeleton/loading-skeleton.tsx";
import { isProduction } from "@/common/utils/utilities.ts";
// import here to allow miragejs backend implementation
//import { makeServer } from "../scripts/server.ts";

const router = createRouter({
	routeTree,
	defaultPendingComponent: () => <LoadingSkeleton />,
	defaultPendingMs: 0,
});

export type TanstackRouter = typeof router;

declare module "@tanstack/react-router" {
	interface Register {
		// This infers the type of our router and registers it across your entire project
		router: TanstackRouter;
	}
}

if (!isProduction) {
    //Enable this to allow mirage backend implementation
	//makeServer();
}

const rootElement = document.querySelector("#root") as Element;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<App router={router} />
		</React.StrictMode>
	);
}
