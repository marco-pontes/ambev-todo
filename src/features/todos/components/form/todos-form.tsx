import type { FunctionComponent } from "@/types/types.ts";
import { AlertType } from "@/types/types.ts";
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
import { type Todo, TodoStatus } from "@/features/todos/types/todo.ts";
import { type TodoFormValues, todoSchema } from "../../schemas/todoSchema.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useApplicationContext } from "@/context/ApplicationContext.tsx";

type TodosFormProperties = Partial<Todo> & {
	onSubmitTodo: (todo: Partial<Todo>) => void;
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
	const { t } = useTranslation();
	const { addMessage } = useApplicationContext();

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

	useEffect(() => {
		if (errors.title) {
			addMessage({
				type: AlertType.error,
				message: t("todos.messages.errors"),
			});
		}
	}, [addMessage, errors.title, t]);

	const handleValid = (data: TodoFormValues): void => {
		onSubmitTodo({ ...data });
		if (!data.id) {
			reset();
		}
	};

	return (
		<Box as="form" onSubmit={handleSubmit(handleValid)}>
			<Fieldset.Root maxW="full">
				<Stack>
					<Fieldset.Legend>{t("todos.form.title")}</Fieldset.Legend>
					<Fieldset.HelperText>{t("todos.form.text")}</Fieldset.HelperText>
				</Stack>

				<Fieldset.Content>
					<Field.Root required invalid={!!errors.title} mb={4}>
						<Field.Label>{t("todos.form.fields.labels.title")}</Field.Label>
						<Input id="title" {...register("title")} />
						<Field.ErrorText>
							{errors.title && errors.title.message}
						</Field.ErrorText>
					</Field.Root>

					<Field.Root invalid={!!errors.description}>
						<Field.Label>
							{t("todos.form.fields.labels.description")}
						</Field.Label>
						<Textarea id="description" {...register("description")} />
						<Field.ErrorText>
							{errors.description && errors.description.message}
						</Field.ErrorText>
					</Field.Root>

					<Field.Root required invalid={!!errors.status}>
						<Field.Label>{t("todos.form.fields.labels.status")}</Field.Label>
						<NativeSelect.Root>
							<NativeSelect.Field id="status" {...register("status")}>
								<For each={[TodoStatus.PENDING, TodoStatus.COMPLETED]}>
									{(item) => (
										<option key={item} value={item}>
											{t(`todos.enums.status.${item}`)}
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
					{t("todos.form.save.button")}
				</Button>
			</Center>
		</Box>
	);
};
