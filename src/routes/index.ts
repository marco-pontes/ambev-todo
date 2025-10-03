import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const HomeLazy = lazy(async () => {
	const module_ = await import("../pages/Home");
	return { default: module_.Home };
});

export const Route = createFileRoute("/")({
	component: HomeLazy,
});
