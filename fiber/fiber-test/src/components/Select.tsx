import { ChevronDown } from "lucide-react";
import type {
	SelectProps as AriaSelectProps,
	ListBoxItemProps,
	ListBoxProps,
	ValidationResult,
} from "react-aria-components";
import {
	Select as AriaSelect,
	Button,
	FieldError,
	Label,
	Popover,
	SelectValue,
} from "react-aria-components";
import { DropdownItem, DropdownListBox } from "./ListBox";
import "../styles/Select.css";
import type React from "react";

export interface SelectProps<T extends object, M extends "single" | "multiple">
	extends Omit<AriaSelectProps<T, M>, "children"> {
	label?: React.ReactNode;
	description?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
	items?: Iterable<T>;
	children: React.ReactNode | ((item: T) => React.ReactNode);
}

export function Select<
	T extends object,
	M extends "single" | "multiple" = "single",
>({ label, errorMessage, children, items, ...props }: SelectProps<T, M>) {
	return (
		<AriaSelect style={{ margin: "-30px auto auto 0px" }} {...props}>
			{label && (
				<Label style={{ marginLeft: "-170px", fontSize: "1.5em" }}>
					{label}
				</Label>
			)}
			<Button
				style={{
					display: "flex",
					alignItems: "center",
					width: "120px",
					height: "50px",
				}}
			>
				<SelectValue />
				<ChevronDown />
			</Button>
			<FieldError>{errorMessage}</FieldError>
			<Popover hideArrow className="select-popover">
				<SelectListBox items={items}>{children}</SelectListBox>
			</Popover>
		</AriaSelect>
	);
}

export function SelectListBox<T extends object>(props: ListBoxProps<T>) {
	return <DropdownListBox {...props} />;
}

export function SelectItem(props: ListBoxItemProps) {
	return <DropdownItem style={{ color: "var(--text)" }} {...props} />;
}
