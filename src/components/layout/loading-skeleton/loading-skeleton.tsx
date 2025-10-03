import type { FunctionComponent } from "../../../types/types.ts";
import {
	Container,
	GridItem,
	SimpleGrid,
	Skeleton,
	SkeletonText,
} from "@chakra-ui/react";

export const LoadingSkeleton = (): FunctionComponent => {
	return (
		<Container>
			<SimpleGrid columns={{ base: 12, md: 12 }}>
				<GridItem colSpan={{ base: 12, md: 12 }}>
					<Skeleton
						h="24"
						variant="shine"
						w="full"
						css={{
							"--start-color": "colors.gray.200",
							"--end-color": "colors.blackAlpha.100",
						}}
					></Skeleton>
				</GridItem>
				<GridItem colSpan={{ base: 12, md: 12 }}>
					<Skeleton h="20" w="full"></Skeleton>
				</GridItem>
				<GridItem colSpan={{ base: 12, md: 12 }}>
					<SkeletonText
						h="9"
						mb={4}
						mt={4}
						noOfLines={1}
						variant="shine"
						w="full"
						css={{
							"--start-color": "colors.gray.200",
							"--end-color": "colors.blackAlpha.100",
						}}
					></SkeletonText>
				</GridItem>
				<GridItem colSpan={{ base: 12, md: 12 }} pl="4" pr="4" pt="6">
					<Skeleton
						h="600px"
						rounded="md"
						variant="shine"
						w="full"
						css={{
							"--start-color": "colors.gray.200",
							"--end-color": "colors.blackAlpha.100",
						}}
					></Skeleton>
				</GridItem>
			</SimpleGrid>
		</Container>
	);
};
