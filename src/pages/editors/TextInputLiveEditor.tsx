import TextInput from "../../../packages/ui/src/components/TextInput.js";
import LiveComponentEditor, { EditorProp } from "../LiveEditor.js";

const textInputProps: EditorProp[] = [
    { name: "size", values: ["xs", "sm", "base", "lg", "xl"] },
    {
        name: "color",
        values: [
            "primary",
            "secondary",
            "neutral",
            "accent",
            "info",
            "success",
            "warning",
            "error",
        ],
    },
    {
        name: "variant",
        values: ["filled", "outline", "underline", "dash", "soft", "ghost"],
    },
    { name: "shape", values: ["square", "rounded", "circle"] },
    { name: "width", values: ["auto", "full"] },
    { name: "label", type: "string" },
    { name: "labelPosition", values: ["left", "center", "right"] },
    { name: "valuePosition", values: ["left", "center", "right"] },
    { name: "placeholder", type: "string" },
    {
        name: "type",
        values: ["text", "email", "password", "number", "search", "tel", "url"],
    },
    { name: "icon" },
    { name: "iconPosition", values: ["left", "right"] },
    { name: "helperText", type: "string" },
    { name: "errorMessage", type: "string" },
    { name: "error", type: "boolean", values: ["true", "false"] },
    { name: "disabled", type: "boolean", values: ["true", "false"] },
    { name: "loading", type: "boolean", values: ["true", "false"] },
    { name: "required", type: "boolean", values: ["true", "false"] },
    { name: "readOnly", type: "boolean", values: ["true", "false"] },
    { name: "autoFocus", type: "boolean", values: ["true", "false"] },
    { name: "maxLength", type: "number" },
    { name: "minLength", type: "number" },
];

const defaultCode =
`<TextInput label="Default" placeholder="Enter text..." />
<TextInput label="Email" type="email" icon="lucide:mail" placeholder="Enter email..." />
<TextInput label="Password" type="password" icon="lucide:lock" placeholder="Enter password..." />
<TextInput label="Search" type="search" icon="lucide:search" placeholder="Search..." />
<TextInput label="Filled" variant="filled" placeholder="Filled input..." />
<TextInput label="Underlined" variant="underlined" placeholder="Underlined input..." />
<TextInput label="Centered" valuePosition="center" placeholder="Centered text..." />
<TextInput label="Right Aligned" valuePosition="right" placeholder="Right-aligned text..." />
<TextInput label="Full Width" width="full" placeholder="Full-width input..." />
<TextInput label="Error" error errorMessage="This field is required." placeholder="Invalid input..." />
<TextInput label="Disabled" disabled placeholder="Disabled input..." />`;

export default function TextInputLiveEditor() {
    return (
        <LiveComponentEditor
            title="Text Input Playground"
            description="Experiment with TextInput props and preview the result."
            defaultCode={defaultCode}
            scope={{ TextInput }}
            props={textInputProps}
        />
    );
}
