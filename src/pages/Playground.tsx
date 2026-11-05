
import { Button, Input } from "../../packages/ui/index.js";
import LiveComponentEditor, {
    type EditorProp,
    type EditorExample,
} from "../components/LiveEditor.js";

/* BUTTON PROPS */

const buttonProps: EditorProp[] = [
    { name: "size", values: ["xs", "sm", "base", "lg", "xl"] },
    {
        name: "color",
        values: ["primary", "secondary", "neutral", "accent", "info", "success", "warning", "error"],
    },
    {
        name: "variant",
        values: ["filled", "outline", "underline", "dash", "soft", "ghost", "link"],
    },
    { name: "shape", values: ["square", "rounded", "circle"] },
    { name: "width", values: ["auto", "full"] },
    { name: "aspect", values: ["auto", "square"] },
    { name: "label", type: "string" },
    {
        name: "icon",
        type: "string",
        values: [
            "lucide:home",
            "lucide:user",
            "lucide:settings",
            "lucide:search",
            "lucide:heart",
            "lucide:star",
            "lucide:bell",
            "lucide:mail",
            "lucide:calendar",
            "lucide:camera",
            "lucide:download",
            "lucide:upload",
            "lucide:edit",
            "lucide:trash-2",
            "lucide:plus",
            "lucide:check",
            "lucide:x",
            "lucide:arrow-left",
            "lucide:arrow-right",
            "lucide:github",
            "mdi:home",
            "mdi:account",
            "mdi:react",
            "tabler:home",
            "ph:house",
            "solar:home-bold",
        ],
    },
    { name: "labelPosition", values: ["left", "center", "right"] },
    { name: "iconPosition", values: ["left", "right", "top", "bottom"] },
    { name: "active", type: "boolean" },
    { name: "disabled", type: "boolean" },
    { name: "loading", type: "boolean" },
    { name: "depth", values: ["flat", "3d"] },
    { name: "backgroundColor", type: "string" },
    { name: "textColor", type: "string" },
];

/* INPUT PROPS */

const inputProps: EditorProp[] = [
    { name: "size", values: ["xs", "sm", "base", "lg", "xl"] },
    {
        name: "color",
        values: ["primary", "secondary", "neutral", "accent", "info", "success", "warning", "error"],
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
    {
        name: "icon",
        type: "string",
        values: [
            "lucide:home",
            "lucide:user",
            "lucide:settings",
            "lucide:search",
            "lucide:heart",
            "lucide:star",
            "lucide:bell",
            "lucide:mail",
            "lucide:calendar",
            "lucide:camera",
            "lucide:download",
            "lucide:upload",
            "lucide:edit",
            "lucide:trash-2",
            "lucide:plus",
            "lucide:check",
            "lucide:x",
            "lucide:arrow-left",
            "lucide:arrow-right",
            "lucide:github",
            "mdi:home",
            "mdi:account",
            "mdi:react",
            "tabler:home",
            "ph:house",
            "solar:home-bold",
        ],
    },
    { name: "iconPosition", values: ["left", "right"] },
    { name: "helperText", type: "string" },
    { name: "errorMessage", type: "string" },
    { name: "error", type: "boolean" },
    { name: "disabled", type: "boolean" },
    { name: "loading", type: "boolean" },
    { name: "required", type: "boolean" },
    { name: "readOnly", type: "boolean" },
    { name: "autoFocus", type: "boolean" },
    { name: "maxLength", type: "number" },
    { name: "minLength", type: "number" },
    { name: "depth", values: ["flat", "3d"] },
    { name: "backgroundColor", type: "string" },
    { name: "textColor", type: "string" },
    { name: "validate", type: "boolean" },
];

/* DEFAULT CODE */

const defaultCode = `
<>
    <div className="flex flex-wrap items-start gap-4">
        <Button label="Default" />
        <Button color="primary" label="Primary" />
        <Button color="secondary" label="Secondary" />
        <Button variant="outline" label="Outline" />
        <Button variant="soft" color="success" label="Success" />
    </div>

    <div className="mt-8 grid max-w-md gap-4">
        <Input label="Name" placeholder="Enter your name..." />
        <Input label="Email" type="email" validate icon="lucide:mail" placeholder="Enter email..." />
        <Input label="Password" type="password" validate icon="lucide:lock" placeholder="Enter password..." />
        <Input label="Search" type="search" placeholder="Search..." />
        <Input label="Error" error errorMessage="This field is required." />
    </div>
</>
`;

/* EXAMPLES */

const examples: EditorExample[] = [
    {
        name: "Basic Buttons",
        category: "Button",
        description: "Basic button variations.",
        code: `
<>
    <Button label="Default" />
    <Button color="primary" label="Primary" />
    <Button color="secondary" label="Secondary" />
    <Button color="success" label="Success" />
</>
`,
    },
    {
        name: "Button Variants",
        category: "Button",
        description: "Different button styles.",
        code: `
<>
    <Button variant="outline" label="Outline" />
    <Button variant="soft" label="Soft" />
    <Button variant="ghost" label="Ghost" />
    <Button variant="link" label="Link" />
</>
`,
    },
    {
        name: "Button States",
        category: "Button",
        description: "Button interaction states.",
        code: `
<>
    <Button label="Disabled" disabled />
    <Button label="Loading" loading />
    <Button label="Active" active />
</>
`,
    },
    {
        name: "Basic Inputs",
        category: "Input",
        description: "Basic input variations.",
        code: `
<>
    <Input label="Name" placeholder="Enter your name..." />
    <Input label="Email" type="email" placeholder="Enter email..." />
    <Input label="Password" type="password" placeholder="Enter password..." />
</>
`,
    },
    {
        name: "Input Variants",
        category: "Input",
        description: "Different input styles.",
        code: `
<>
    <Input variant="filled" placeholder="Filled input..." />
    <Input variant="outline" placeholder="Outlined input..." />
    <Input variant="soft" placeholder="Soft input..." />
</>
`,
    },
    {
        name: "Input States",
        category: "Input",
        description: "Input interaction states.",
        code: `
<>
    <Input label="Disabled" disabled />
    <Input label="Required" required />
    <Input label="Error" error errorMessage="Invalid input" />
</>
`,
    },
];

/* PLAYGROUND */

export default function Playground() {
    return (
        <LiveComponentEditor
            title="Component Playground"
            description="Experiment with Button and Input components together."
            defaultCode={defaultCode}
            scope={{ Button, Input }}
            props={{
                Button: buttonProps,
                Input: inputProps,
            }}
            examples={examples}
            language="typescript"
        />
    );
}
