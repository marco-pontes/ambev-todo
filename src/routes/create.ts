import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const CreateLazy = lazy(async () => {
	const module_ = await import("../pages/Create");
	return { default: module_.Create };
});

export const Route = createFileRoute("/create")({
	component: CreateLazy,
});
