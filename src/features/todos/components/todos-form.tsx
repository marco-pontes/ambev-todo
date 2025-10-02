import type { FunctionComponent } from "@/types/types.ts";
import {
	Box,
	Button,
	Center,
	Field,
	Fieldset,
	For,
	Input,
	NativeSelect,
	Stack,
	Textarea,
} from "@chakra-ui/react";
import {
	type UpdateTodoVariables,
	TodoStatus,
} from "@/features/todos/types/todo.ts";
import { type TodoFormValues, todoSchema } from "../schemas/todoSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type TodosFormProperties = UpdateTodoVariables & {
	onSubmitTodo: (todo: UpdateTodoVariables) => void;
	submitDisabled: boolean;
};

export const TodosForm = ({
	id,
	title,
	description,
	status,
	onSubmitTodo,
	submitDisabled,
}: TodosFormProperties): FunctionComponent => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<TodoFormValues>({
		mode: "onChange",
		resolver: zodResolver(todoSchema),
		defaultValues: {
			id: id,
			title: title,
			description: description,
			status: status,
		},
	});

	const handleSubmitTodo = (data: TodoFormValues): void => {
		onSubmitTodo({ ...data });
		if (!data.id) {
			reset();
		}
	};

	return (
		<Box as="form" onSubmit={handleSubmit(handleSubmitTodo)}>
			<Fieldset.Root maxW="full">
				<Stack>
					<Fieldset.Legend>To-do details</Fieldset.Legend>
					<Fieldset.HelperText>
						Please provide the To-do details below.
					</Fieldset.HelperText>
				</Stack>

				<Fieldset.Content>
					<Field.Root required invalid={!!errors.title} mb={4}>
						<Field.Label>Title</Field.Label>
						<Input id="title" {...register("title")} />
						<Field.ErrorText>
							{errors.title && errors.title.message}
						</Field.ErrorText>
					</Field.Root>

					<Field.Root invalid={!!errors.description}>
						<Field.Label>Description</Field.Label>
						<Textarea id="description" {...register("description")} />
						<Field.ErrorText>
							{errors.description && errors.description.message}
						</Field.ErrorText>
					</Field.Root>

					<Field.Root required invalid={!!errors.status}>
						<Field.Label>Status</Field.Label>
						<NativeSelect.Root>
							<NativeSelect.Field id="status" {...register("status")}>
								<For each={[TodoStatus.PENDING, TodoStatus.COMPLETED]}>
									{(item) => (
										<option key={item} value={item}>
											{item}
										</option>
									)}
								</For>
							</NativeSelect.Field>
							<NativeSelect.Indicator />
						</NativeSelect.Root>
						<Field.ErrorText>
							{errors.status && errors.status.message}
						</Field.ErrorText>
					</Field.Root>
				</Fieldset.Content>
			</Fieldset.Root>
			<Center p={10}>
				<Button loading={isSubmitting || submitDisabled} type={"submit"}>
					Salvar
				</Button>
			</Center>
		</Box>
	);
};
