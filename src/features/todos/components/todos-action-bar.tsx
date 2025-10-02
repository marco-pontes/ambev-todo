import type { FunctionComponent } from "@/types/types.ts";
import { useApplicationContext } from "@/context/ApplicationContext.tsx";
import { ActionBar, Button, Kbd, Portal } from "@chakra-ui/react";

export const TodosActionBar = (): FunctionComponent => {
	const { selection } = useApplicationContext();
	const hasSelection = selection.length > 0;
	return (
		<ActionBar.Root open={hasSelection}>
			<Portal>
				<ActionBar.Positioner>
					<ActionBar.Content>
						<ActionBar.SelectionTrigger>
							{selection.length} selected
						</ActionBar.SelectionTrigger>
						<ActionBar.Separator />
						<Button size="sm" variant="outline">
							Delete <Kbd>⌫</Kbd>
						</Button>
					</ActionBar.Content>
				</ActionBar.Positioner>
			</Portal>
		</ActionBar.Root>
	);
};
