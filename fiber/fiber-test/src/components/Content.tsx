import type { HeadingProps, TextProps } from "react-aria-components";
import {
	Heading as AriaHeading,
	Text as AriaText,
} from "react-aria-components";
import "../styles/Content.css";

export function Heading(props: HeadingProps) {
	return <AriaHeading {...props} />;
}

export function Text(props: TextProps) {
	return <AriaText {...props} />;
}
