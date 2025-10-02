import type { FunctionComponent } from "@/types/types.ts";
import { useApplicationContext } from "@/context/ApplicationContext.tsx";
import { ButtonGroup, IconButton, Pagination } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export const TodosPagination = (): FunctionComponent => {
	const { page, setPage, totalResults } = useApplicationContext();
	return (
		<Pagination.Root
			count={totalResults}
			page={page}
			pageSize={10}
			onPageChange={(details) => {
				setPage(details.page);
			}}
		>
			<ButtonGroup size="sm" variant="outline">
				<Pagination.PrevTrigger asChild>
					<IconButton>
						<LuChevronLeft />
					</IconButton>
				</Pagination.PrevTrigger>

				<Pagination.Items
					render={(page) => (
						<IconButton variant={{ base: "outline", _selected: "solid" }}>
							{page.value}
						</IconButton>
					)}
				/>

				<Pagination.NextTrigger asChild>
					<IconButton>
						<LuChevronRight />
					</IconButton>
				</Pagination.NextTrigger>
			</ButtonGroup>
		</Pagination.Root>
	);
};
