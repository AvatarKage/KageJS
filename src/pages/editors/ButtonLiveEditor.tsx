import Button from "../../../packages/ui/src/components/Button.js";
import LiveComponentEditor, { type EditorProp } from "../LiveEditor.js";

const buttonProps: EditorProp[] = [
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
        values: ["filled", "outline", "underline", "dash", "soft", "ghost", "link"],
    },
    { name: "shape", values: ["square", "rounded", "circle"] },
    { name: "width", values: ["auto", "full"] },
    { name: "aspect", values: ["auto", "square"] },
    { name: "label", type: "string" },
    { name: "icon" },
    { name: "labelPosition", values: ["left", "center", "right"] },
    { name: "iconPosition", values: ["left", "right", "top", "bottom"] },
    { name: "active", type: "boolean", values: ["true", "false"] },
    { name: "disabled", type: "boolean", values: ["true", "false"] },
    { name: "loading", type: "boolean", values: ["true", "false"] },
    { name: "interaction", values: ["none", "press", "scale", "offset"] }
];

const defaultCode = 
`<Button label="Default" />
<Button color="primary" label="Primary" />
<Button color="secondary" label="Secondary" />
<Button color="success" label="Success" />
<Button variant="outline" color="primary" label="Outline" />
<Button variant="soft" color="accent" label="Soft" />`;

export default function ButtonLiveEditor() {
    return (
        <LiveComponentEditor
            title="Button Playground"
            description="Experiment with Button props and preview the result."
            defaultCode={defaultCode}
            scope={{ Button }}
            props={buttonProps}
        />
    );
}
