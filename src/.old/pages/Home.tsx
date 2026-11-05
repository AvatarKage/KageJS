import { useState, type ReactNode } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "react-syntax-highlighter/dist/esm/styles/prism";
import ButtonLiveEditor from "./editors/ButtonLiveEditor.js";
import InputLiveEditor from "./editors/InputLiveEditor.js";
import Button from "../../../packages/ui/src/components/Button.js";
import Input from "../../../packages/ui/src/components/Input.js";

type Example = {
    id: string;
    title: string;
    code: string;
    component: ReactNode;
};

type ExampleGroup = {
    id: string;
    label: string;
    examples: Example[];
};

type ComponentDefinition = {
    id: string;
    label: string;
    groups: ExampleGroup[];
};

const buttonComponent: ComponentDefinition = {
    id: "button",
    label: "Button",
    groups: [
        {
            id: "presets",
            label: "Presets",
            examples: [
                {
                    id: "size",
                    title: "Size",
                    code: [
                        `<Button size="xs" label="Extra Small" />`,
                        `<Button size="sm" label="Small" />`,
                        `<Button size="base" label="Base" />`,
                        `<Button size="lg" label="Large" />`,
                        `<Button size="xl" label="Extra Large" />`,
                    ].join("\n"),
                    component: (
                        <>
                            <Button size="xs" label="Extra Small" />
                            <Button size="sm" label="Small" />
                            <Button size="base" label="Base" />
                            <Button size="lg" label="Large" />
                            <Button size="xl" label="Extra Large" />
                        </>
                    ),
                },
                {
                    id: "color",
                    title: "Color",
                    code: [
                        `<Button color="neutral" label="Neutral" />`,
                        `<Button color="primary" label="Primary" />`,
                        `<Button color="secondary" label="Secondary" />`,
                        `<Button color="accent" label="Accent" />`,
                        `<Button color="info" label="Info" />`,
                        `<Button color="success" label="Success" />`,
                        `<Button color="warning" label="Warning" />`,
                        `<Button color="error" label="Error" />`,
                    ].join("\n"),
                    component: (
                        <>
                            <Button color="neutral" label="Neutral" />
                            <Button color="primary" label="Primary" />
                            <Button color="secondary" label="Secondary" />
                            <Button color="accent" label="Accent" />
                            <Button color="info" label="Info" />
                            <Button color="success" label="Success" />
                            <Button color="warning" label="Warning" />
                            <Button color="error" label="Error" />
                        </>
                    ),
                },
                {
                    id: "variant",
                    title: "Variant",
                    code: [
                        `<Button variant="filled" color="primary" label="Filled" />`,
                        `<Button variant="outline" color="primary" label="Outline" />`,
                        `<Button variant="underline" color="primary" label="Outline" />`,
                        `<Button variant="dash" color="primary" label="Dash" />`,
                        `<Button variant="soft" color="primary" label="Soft" />`,
                        `<Button variant="ghost" color="primary" label="Ghost" />`,
                        `<Button variant="link" color="primary" label="Link" />`,
                    ].join("\n"),
                    component: (
                        <>
                            <Button variant="filled" color="primary" label="Filled" />
                            <Button variant="outline" color="primary" label="Outline" />
                            <Button variant="underline" color="primary" label="Underline" />
                            <Button variant="dash" color="primary" label="Dash" />
                            <Button variant="soft" color="primary" label="Soft" />
                            <Button variant="ghost" color="primary" label="Ghost" />
                            <Button variant="link" color="primary" label="Link" />
                        </>
                    ),
                },
                {
                    id: "shape",
                    title: "Shape",
                    code: [
                        `<Button shape="square" label="Square" />`,
                        `<Button shape="rounded" label="Rounded" />`,
                        `<Button shape="circle" label="Circle" />`,
                        `<Button shape="circle" icon="lucide:plus" aria-label="Add" />`,
                    ].join("\n"),
                    component: (
                        <>
                            <Button shape="square" label="Square" />
                            <Button shape="rounded" label="Rounded" />
                            <Button shape="circle" label="Circle" />
                            <Button
                                shape="circle"
                                icon="lucide:plus"
                                aria-label="Add"
                            />
                        </>
                    ),
                },
                {
                    id: "width",
                    title: "Width",
                    code: [
                        `<Button width="auto" label="Auto Width" />`,
                        `<Button width="full" label="Full Width" />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full flex-col items-start gap-3">
                            <Button width="auto" label="Auto Width" />
                            <Button width="full" label="Full Width" />
                        </div>
                    ),
                },
                {
                    id: "aspect",
                    title: "Aspect",
                    code: [
                        `<Button aspect="auto" label="Auto Aspect" />`,
                        `<Button aspect="square" icon="lucide:plus" aria-label="Add" />`,
                    ].join("\n"),
                    component: (
                        <>
                            <Button aspect="auto" label="Auto Aspect" />
                            <Button
                                aspect="square"
                                icon="lucide:plus"
                                aria-label="Add"
                            />
                        </>
                    ),
                },
            ],
        },
        {
            id: "icons",
            label: "Icons",
            examples: [
                {
                    id: "icon",
                    title: "Icon",
                    code: [
                        `<Button icon="lucide:plus" label="Add" />`,
                        `<Button icon="lucide:save" label="Save" />`,
                        `<Button icon="lucide:download" label="Download" />`,
                        `<Button icon="lucide:trash-2" label="Delete" />`,
                    ].join("\n"),
                    component: (
                        <>
                            <Button icon="lucide:plus" label="Add" />
                            <Button icon="lucide:save" label="Save" />
                            <Button icon="lucide:download" label="Download" />
                            <Button icon="lucide:trash-2" label="Delete" />
                        </>
                    ),
                },
                {
                    id: "icon-only",
                    title: "Icon Only",
                    code: [
                        `<Button icon="lucide:plus" aria-label="Add" />`,
                        `<Button icon="lucide:pencil" aria-label="Edit" />`,
                        `<Button icon="lucide:settings" aria-label="Settings" />`,
                        `<Button icon="lucide:trash-2" aria-label="Delete" />`,
                    ].join("\n"),
                    component: (
                        <>
                            <Button icon="lucide:plus" aria-label="Add" />
                            <Button icon="lucide:pencil" aria-label="Edit" />
                            <Button icon="lucide:settings" aria-label="Settings" />
                            <Button icon="lucide:trash-2" aria-label="Delete" />
                        </>
                    ),
                },
                {
                    id: "icon-position",
                    title: "Icon Position",
                    code: [
                        `<Button icon="lucide:arrow-left" iconPosition="left" label="Left Icon" />`,
                        `<Button icon="lucide:arrow-right" iconPosition="right" label="Right Icon" />`,
                        `<Button icon="lucide:arrow-up" iconPosition="top" label="Top Icon" />`,
                        `<Button icon="lucide:arrow-down" iconPosition="bottom" label="Bottom Icon" />`,
                    ].join("\n"),
                    component: (
                        <>
                            <Button
                                icon="lucide:arrow-left"
                                iconPosition="left"
                                label="Left Icon"
                            />
                            <Button
                                icon="lucide:arrow-right"
                                iconPosition="right"
                                label="Right Icon"
                            />
                            <Button
                                icon="lucide:arrow-up"
                                iconPosition="top"
                                label="Top Icon"
                            />
                            <Button
                                icon="lucide:arrow-down"
                                iconPosition="bottom"
                                label="Bottom Icon"
                            />
                        </>
                    ),
                },
                {
                    id: "icon-shape",
                    title: "Icon Shape",
                    code: [
                        `<Button shape="square" icon="lucide:plus" aria-label="Add" />`,
                        `<Button shape="rounded" icon="lucide:plus" aria-label="Add" />`,
                        `<Button shape="circle" icon="lucide:plus" aria-label="Add" />`,
                    ].join("\n"),
                    component: (
                        <>
                            <Button
                                shape="square"
                                icon="lucide:plus"
                                aria-label="Add"
                            />
                            <Button
                                shape="rounded"
                                icon="lucide:plus"
                                aria-label="Add"
                            />
                            <Button
                                shape="circle"
                                icon="lucide:plus"
                                aria-label="Add"
                            />
                        </>
                    ),
                },
                {
                    id: "icon-size",
                    title: "Icon Size",
                    code: [
                        `<Button size="xs" icon="lucide:plus" aria-label="Add" />`,
                        `<Button size="sm" icon="lucide:plus" aria-label="Add" />`,
                        `<Button size="base" icon="lucide:plus" aria-label="Add" />`,
                        `<Button size="lg" icon="lucide:plus" aria-label="Add" />`,
                        `<Button size="xl" icon="lucide:plus" aria-label="Add" />`,
                    ].join("\n"),
                    component: (
                        <>
                            <Button size="xs" icon="lucide:plus" aria-label="Add" />
                            <Button size="sm" icon="lucide:plus" aria-label="Add" />
                            <Button size="base" icon="lucide:plus" aria-label="Add" />
                            <Button size="lg" icon="lucide:plus" aria-label="Add" />
                            <Button size="xl" icon="lucide:plus" aria-label="Add" />
                        </>
                    ),
                },
            ],
        },
        {
            id: "states",
            label: "States",
            examples: [
                {
                    id: "active",
                    title: "Active",
                    code: [
                        `<Button label="Default" />`,
                        `<Button active label="Active" />`,
                        `<Button active color="primary" label="Primary Active" />`,
                        `<Button active color="accent" label="Accent Active" />`,
                    ].join("\n"),
                    component: (
                        <>
                            <Button label="Default" />
                            <Button active label="Active" />
                            <Button active color="primary" label="Primary Active" />
                            <Button active color="accent" label="Accent Active" />
                        </>
                    ),
                },
                {
                    id: "disabled",
                    title: "Disabled",
                    code: [
                        `<Button disabled label="Disabled" />`,
                        `<Button disabled variant="outline" label="Outline" />`,
                        `<Button disabled variant="soft" label="Soft" />`,
                        `<Button disabled icon="lucide:lock" label="Locked" />`,
                    ].join("\n"),
                    component: (
                        <>
                            <Button disabled label="Disabled" />
                            <Button disabled variant="outline" label="Outline" />
                            <Button disabled variant="soft" label="Soft" />
                            <Button disabled icon="lucide:lock" label="Locked" />
                        </>
                    ),
                },
                {
                    id: "loading",
                    title: "Loading",
                    code: [
                        `<Button loading label="Loading" />`,
                        `<Button loading color="primary" label="Processing" />`,
                        `<Button loading color="success" label="Saving" />`,
                        `<Button loading variant="outline" label="Please Wait" />`,
                    ].join("\n"),
                    component: (
                        <>
                            <Button loading label="Loading" />
                            <Button loading color="primary" label="Processing" />
                            <Button loading color="success" label="Saving" />
                            <Button loading variant="outline" label="Please Wait" />
                        </>
                    ),
                },
                {
                    id: "loading-icon",
                    title: "Loading Icon",
                    code: [
                        `<Button loading icon="lucide:save" label="Saving" />`,
                        `<Button loading icon="lucide:download" label="Downloading" />`,
                        `<Button loading icon="lucide:upload" label="Uploading" />`,
                    ].join("\n"),
                    component: (
                        <>
                            <Button loading icon="lucide:save" label="Saving" />
                            <Button loading icon="lucide:download" label="Downloading" />
                            <Button loading icon="lucide:upload" label="Uploading" />
                        </>
                    ),
                },
                {
                    id: "state-comparison",
                    title: "State Comparison",
                    code: [
                        `<Button label="Default" />`,
                        `<Button active label="Active" />`,
                        `<Button disabled label="Disabled" />`,
                        `<Button loading label="Loading" />`,
                    ].join("\n"),
                    component: (
                        <>
                            <Button label="Default" />
                            <Button active label="Active" />
                            <Button disabled label="Disabled" />
                            <Button loading label="Loading" />
                        </>
                    ),
                },
            ],
        },
        {
            id: "interactions",
            label: "Interactions",
            examples: [
                {
                    id: "interaction",
                    title: "Interaction",
                    code: [
                        `<Button interaction="none" label="None" />`,
                        `<Button interaction="press" label="Press" />`,
                        `<Button interaction="scale" label="Scale" />`,
                        `<Button interaction="offset" label="Offset" />`,
                    ].join("\n"),
                    component: (
                        <>
                            <Button interaction="none" label="None" />
                            <Button interaction="press" label="Press" />
                            <Button interaction="scale" label="Scale" />
                            <Button interaction="offset" label="Offset" />
                        </>
                    ),
                },
                {
                    id: "interaction-variants",
                    title: "Interaction Variants",
                    code: [
                        `<Button variant="filled" interaction="press" label="Press" />`,
                        `<Button variant="outline" interaction="scale" label="Scale" />`,
                        `<Button variant="soft" interaction="offset" label="Offset" />`,
                        `<Button variant="ghost" interaction="none" label="None" />`,
                    ].join("\n"),
                    component: (
                        <>
                            <Button variant="filled" interaction="press" label="Press" />
                            <Button variant="outline" interaction="scale" label="Scale" />
                            <Button variant="soft" interaction="offset" label="Offset" />
                            <Button variant="ghost" interaction="none" label="None" />
                        </>
                    ),
                },
            ],
        },
        {
            id: "combinations",
            label: "Combinations",
            examples: [
                {
                    id: "navigation",
                    title: "Navigation",
                    code: [
                        `<Button variant="outline" icon="lucide:arrow-left" iconPosition="left" label="Previous" />`,
                        `<Button color="primary" icon="lucide:arrow-right" iconPosition="right" label="Next" />`,
                    ].join("\n"),
                    component: (
                        <>
                            <Button
                                variant="outline"
                                icon="lucide:arrow-left"
                                iconPosition="left"
                                label="Previous"
                            />
                            <Button
                                color="primary"
                                icon="lucide:arrow-right"
                                iconPosition="right"
                                label="Next"
                            />
                        </>
                    ),
                },
                {
                    id: "toolbar",
                    title: "Toolbar",
                    code: [
                        `<Button variant="ghost" icon="lucide:bold" aria-label="Bold" />`,
                        `<Button variant="ghost" icon="lucide:italic" aria-label="Italic" />`,
                        `<Button variant="ghost" icon="lucide:underline" aria-label="Underline" />`,
                        `<Button variant="ghost" icon="lucide:link" aria-label="Link" />`,
                    ].join("\n"),
                    component: (
                        <>
                            <Button variant="ghost" icon="lucide:bold" aria-label="Bold" />
                            <Button variant="ghost" icon="lucide:italic" aria-label="Italic" />
                            <Button variant="ghost" icon="lucide:underline" aria-label="Underline" />
                            <Button variant="ghost" icon="lucide:link" aria-label="Link" />
                        </>
                    ),
                },
                {
                    id: "status",
                    title: "Status",
                    code: [
                        `<Button color="info" variant="soft" icon="lucide:info" label="Information" />`,
                        `<Button color="success" variant="soft" icon="lucide:check-circle" label="Success" />`,
                        `<Button color="warning" variant="soft" icon="lucide:alert-triangle" label="Warning" />`,
                        `<Button color="error" variant="soft" icon="lucide:alert-circle" label="Error" />`,
                    ].join("\n"),
                    component: (
                        <>
                            <Button color="info" variant="soft" icon="lucide:info" label="Information" />
                            <Button color="success" variant="soft" icon="lucide:check-circle" label="Success" />
                            <Button color="warning" variant="soft" icon="lucide:alert-triangle" label="Warning" />
                            <Button color="error" variant="soft" icon="lucide:alert-circle" label="Error" />
                        </>
                    ),
                },
                {
                    id: "call-to-action",
                    title: "Call to Action",
                    code: [
                        `<Button size="lg" color="accent" shape="circle" interaction="scale" icon="lucide:rocket" label="Get Started" />`,
                        `<Button size="lg" color="primary" variant="outline" shape="circle" icon="lucide:arrow-right" iconPosition="right" label="Learn More" />`,
                    ].join("\n"),
                    component: (
                        <>
                            <Button
                                size="lg"
                                color="accent"
                                shape="circle"
                                interaction="scale"
                                icon="lucide:rocket"
                                label="Get Started"
                            />
                            <Button
                                size="lg"
                                color="primary"
                                variant="outline"
                                shape="circle"
                                icon="lucide:arrow-right"
                                iconPosition="right"
                                label="Learn More"
                            />
                        </>
                    ),
                },
                {
                    id: "full-width-actions",
                    title: "Full Width Actions",
                    code: [
                        `<Button width="full" icon="lucide:log-in" label="Sign In" />`,
                        `<Button width="full" variant="outline" icon="lucide:user-plus" label="Create Account" />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-3">
                            <Button
                                width="full"
                                icon="lucide:log-in"
                                label="Sign In"
                            />
                            <Button
                                width="full"
                                variant="outline"
                                icon="lucide:user-plus"
                                label="Create Account"
                            />
                        </div>
                    ),
                },
                {
                    id: "social-login",
                    title: "Social Login",
                    code: [
                        `<Button icon="logos:google-icon" style={{ "--color-primary": "#ffffff", "--color-primary-content": "#000000" } as React.CSSProperties} />`,
                        `<Button icon="simple-icons:apple" style={{ "--color-primary": "#000000", "--color-primary-content": "#ffffff" } as React.CSSProperties} />`,
                        `<Button icon="logos:microsoft-icon" style={{ "--color-primary": "#ffffff", "--color-primary-content": "#000000" } as React.CSSProperties} />`,
                        `<Button icon="simple-icons:facebook" style={{ "--color-primary": "#0866FF", "--color-primary-content": "#ffffff" } as React.CSSProperties} />`,
                        `<Button icon="simple-icons:github" style={{ "--color-primary": "#181717", "--color-primary-content": "#ffffff" } as React.CSSProperties} />`,
                        `<Button icon="simple-icons:discord" style={{ "--color-primary": "#5865F2", "--color-primary-content": "#ffffff" } as React.CSSProperties} />`,
                        `<Button icon="simple-icons:reddit" style={{ "--color-primary": "#FF4500", "--color-primary-content": "#ffffff" } as React.CSSProperties} />`,
                        `<Button icon="simple-icons:x" style={{ "--color-primary": "#000000", "--color-primary-content": "#ffffff" } as React.CSSProperties} />`,
                        `<Button icon="simple-icons:gitlab" style={{ "--color-primary": "#FC6D26", "--color-primary-content": "#ffffff" } as React.CSSProperties} />`,
                        `<Button icon="simple-icons:spotify" style={{ "--color-primary": "#1ED760", "--color-primary-content": "#000000" } as React.CSSProperties} />`,
                        `<Button icon="simple-icons:amazon" style={{ "--color-primary": "#000000", "--color-primary-content": "#ffffff" } as React.CSSProperties} />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-row gap-3">
                            <Button
                                icon="logos:google-icon"
                                style={{
                                    "--color-primary": "#ffffff",
                                    "--color-primary-content": "#000000"
                                } as React.CSSProperties}
                            />

                            <Button
                                icon="simple-icons:apple"
                                style={{
                                    "--color-primary": "#000000",
                                    "--color-primary-content": "#ffffff"
                                } as React.CSSProperties}
                            />

                            <Button
                                icon="logos:microsoft-icon"
                                style={{
                                    "--color-primary": "#ffffff",
                                    "--color-primary-content": "#000000"
                                } as React.CSSProperties}
                            />

                            <Button
                                icon="simple-icons:facebook"
                                style={{
                                    "--color-primary": "#0866FF",
                                    "--color-primary-content": "#ffffff"
                                } as React.CSSProperties}
                            />

                            <Button
                                icon="simple-icons:github"
                                style={{
                                    "--color-primary": "#181717",
                                    "--color-primary-content": "#ffffff"
                                } as React.CSSProperties}
                            />

                            <Button
                                icon="simple-icons:discord"
                                style={{
                                    "--color-primary": "#5865F2",
                                    "--color-primary-content": "#ffffff"
                                } as React.CSSProperties}
                            />

                            <Button
                                icon="simple-icons:reddit"
                                style={{
                                    "--color-primary": "#FF4500",
                                    "--color-primary-content": "#ffffff"
                                } as React.CSSProperties}
                            />

                            <Button
                                icon="simple-icons:x"
                                style={{
                                    "--color-primary": "#000000",
                                    "--color-primary-content": "#ffffff"
                                } as React.CSSProperties}
                            />

                            <Button
                                icon="simple-icons:gitlab"
                                style={{
                                    "--color-primary": "#FC6D26",
                                    "--color-primary-content": "#ffffff"
                                } as React.CSSProperties}
                            />

                            <Button
                                icon="simple-icons:spotify"
                                style={{
                                    "--color-primary": "#1ED760",
                                    "--color-primary-content": "#000000"
                                } as React.CSSProperties}
                            />

                            <Button
                                icon="simple-icons:amazon"
                                style={{
                                    "--color-primary": "#000000",
                                    "--color-primary-content": "#ffffff"
                                } as React.CSSProperties}
                            />
                        </div>
                    ),
                },
                {
                    id: "social-login-full",
                    title: "Social Login Full",
                    code: [
                        `<Button width="full" icon="logos:google-icon" label="Continue with Google" style={{ "--color-primary": "#ffffff", "--color-primary-content": "#000000" } as React.CSSProperties} />`,
                        `<Button width="full" icon="simple-icons:apple" label="Continue with Apple" style={{ "--color-primary": "#000000", "--color-primary-content": "#ffffff" } as React.CSSProperties} />`,
                        `<Button width="full" icon="logos:microsoft-icon" label="Continue with Microsoft" style={{ "--color-primary": "#ffffff", "--color-primary-content": "#000000" } as React.CSSProperties} />`,
                        `<Button width="full" icon="simple-icons:facebook" label="Continue with Facebook" style={{ "--color-primary": "#0866FF", "--color-primary-content": "#ffffff" } as React.CSSProperties} />`,
                        `<Button width="full" icon="simple-icons:github" label="Continue with GitHub" style={{ "--color-primary": "#181717", "--color-primary-content": "#ffffff" } as React.CSSProperties} />`,
                        `<Button width="full" icon="simple-icons:discord" label="Continue with Discord" style={{ "--color-primary": "#5865F2", "--color-primary-content": "#ffffff" } as React.CSSProperties} />`,
                        `<Button width="full" icon="simple-icons:reddit" label="Continue with Reddit" style={{ "--color-primary": "#FF4500", "--color-primary-content": "#ffffff" } as React.CSSProperties} />`,
                        `<Button width="full" icon="simple-icons:x" label="Continue with X" style={{ "--color-primary": "#000000", "--color-primary-content": "#ffffff" } as React.CSSProperties} />`,
                        `<Button width="full" icon="simple-icons:gitlab" label="Continue with GitLab" style={{ "--color-primary": "#FC6D26", "--color-primary-content": "#ffffff" } as React.CSSProperties} />`,
                        `<Button width="full" icon="simple-icons:spotify" label="Continue with Spotify" style={{ "--color-primary": "#1ED760", "--color-primary-content": "#000000" } as React.CSSProperties} />`,
                        `<Button width="full" icon="simple-icons:amazon" label="Continue with Amazon" style={{ "--color-primary": "#000000", "--color-primary-content": "#ffffff" } as React.CSSProperties} />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-3">
                            <Button
                                width="full"
                                icon="logos:google-icon"
                                label="Continue with Google"
                                style={{
                                    "--color-primary": "#ffffff",
                                    "--color-primary-content": "#000000"
                                } as React.CSSProperties}
                            />

                            <Button
                                width="full"
                                icon="simple-icons:apple"
                                label="Continue with Apple"
                                style={{
                                    "--color-primary": "#000000",
                                    "--color-primary-content": "#ffffff"
                                } as React.CSSProperties}
                            />

                            <Button
                                width="full"
                                icon="logos:microsoft-icon"
                                label="Continue with Microsoft"
                                style={{
                                    "--color-primary": "#ffffff",
                                    "--color-primary-content": "#000000"
                                } as React.CSSProperties}
                            />

                            <Button
                                width="full"
                                icon="simple-icons:facebook"
                                label="Continue with Facebook"
                                style={{
                                    "--color-primary": "#0866FF",
                                    "--color-primary-content": "#ffffff"
                                } as React.CSSProperties}
                            />

                            <Button
                                width="full"
                                icon="simple-icons:github"
                                label="Continue with GitHub"
                                style={{
                                    "--color-primary": "#181717",
                                    "--color-primary-content": "#ffffff"
                                } as React.CSSProperties}
                            />

                            <Button
                                width="full"
                                icon="simple-icons:discord"
                                label="Continue with Discord"
                                style={{
                                    "--color-primary": "#5865F2",
                                    "--color-primary-content": "#ffffff"
                                } as React.CSSProperties}
                            />

                            <Button
                                width="full"
                                icon="simple-icons:reddit"
                                label="Continue with Reddit"
                                style={{
                                    "--color-primary": "#FF4500",
                                    "--color-primary-content": "#ffffff"
                                } as React.CSSProperties}
                            />

                            <Button
                                width="full"
                                icon="simple-icons:x"
                                label="Continue with X"
                                style={{
                                    "--color-primary": "#000000",
                                    "--color-primary-content": "#ffffff"
                                } as React.CSSProperties}
                            />

                            <Button
                                width="full"
                                icon="simple-icons:gitlab"
                                label="Continue with GitLab"
                                style={{
                                    "--color-primary": "#FC6D26",
                                    "--color-primary-content": "#ffffff"
                                } as React.CSSProperties}
                            />

                            <Button
                                width="full"
                                icon="simple-icons:spotify"
                                label="Continue with Spotify"
                                style={{
                                    "--color-primary": "#1ED760",
                                    "--color-primary-content": "#000000"
                                } as React.CSSProperties}
                            />

                            <Button
                                width="full"
                                icon="simple-icons:amazon"
                                label="Continue with Amazon"
                                style={{
                                    "--color-primary": "#000000",
                                    "--color-primary-content": "#ffffff"
                                } as React.CSSProperties}
                            />
                        </div>
                    ),
                }
            ],
        },
    ],
}

const InputComponent: ComponentDefinition = {
    id: "text-input",
    label: "Text Input",
    groups: [
        {
            id: "presets",
            label: "Presets",
            examples: [
                {
                    id: "size",
                    title: "Size",
                    code: [
                        `<Input size="xs" placeholder="Extra Small" />`,
                        `<Input size="sm" placeholder="Small" />`,
                        `<Input size="base" placeholder="Base" />`,
                        `<Input size="lg" placeholder="Large" />`,
                        `<Input size="xl" placeholder="Extra Large" />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-3">
                            <Input size="xs" placeholder="Extra Small" />
                            <Input size="sm" placeholder="Small" />
                            <Input size="base" placeholder="Base" />
                            <Input size="lg" placeholder="Large" />
                            <Input size="xl" placeholder="Extra Large" />
                        </div>
                    ),
                },
                {
                    id: "color",
                    title: "Color",
                    code: [
                        `<Input color="neutral" placeholder="Neutral" />`,
                        `<Input color="primary" placeholder="Primary" />`,
                        `<Input color="secondary" placeholder="Secondary" />`,
                        `<Input color="accent" placeholder="Accent" />`,
                        `<Input color="info" placeholder="Info" />`,
                        `<Input color="success" placeholder="Success" />`,
                        `<Input color="warning" placeholder="Warning" />`,
                        `<Input color="error" placeholder="Error" />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-3">
                            <Input color="neutral" placeholder="Neutral" />
                            <Input color="primary" placeholder="Primary" />
                            <Input color="secondary" placeholder="Secondary" />
                            <Input color="accent" placeholder="Accent" />
                            <Input color="info" placeholder="Info" />
                            <Input color="success" placeholder="Success" />
                            <Input color="warning" placeholder="Warning" />
                            <Input color="error" placeholder="Error" />
                        </div>
                    ),
                },
                {
                    id: "labels",
                    title: "Labels",
                    code: [
                        `<Input label="Username" placeholder="Enter username" />`,
                        `<Input label="Email" type="email" placeholder="Enter email" />`,
                        `<Input label="Password" type="password" placeholder="Enter password" />`,
                        `<Input label="Required Field" required placeholder="This field is required" />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-4">
                            <Input label="Username" placeholder="Enter username" />
                            <Input label="Email" type="email" placeholder="Enter email" />
                            <Input label="Password" type="password" placeholder="Enter password" />
                            <Input
                                label="Required Field"
                                required
                                placeholder="This field is required"
                            />
                        </div>
                    ),
                },
                {
                    id: "label-position",
                    title: "Label Position",
                    code: [
                        `<Input label="Left Label" labelPosition="left" placeholder="Enter text" />`,
                        `<Input label="Centered Label" labelPosition="center" placeholder="Enter text" />`,
                        `<Input label="Right Label" labelPosition="right" placeholder="Enter text" />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-4">
                            <Input
                                label="Left Label"
                                labelPosition="left"
                                placeholder="Enter text"
                                width="full"
                            />
                            <Input
                                label="Centered Label"
                                labelPosition="center"
                                placeholder="Enter text"
                                width="full"
                            />
                            <Input
                                label="Right Label"
                                labelPosition="right"
                                placeholder="Enter text"
                                width="full"
                            />
                        </div>
                    ),
                },
                {
                    id: "variant",
                    title: "Variant",
                    code: [
                        `<Input variant="filled" label="Filled" placeholder="Enter text" />`,
                        `<Input variant="outline" label="Outline" placeholder="Enter text" />`,
                        `<Input variant="underline" label="Underline" placeholder="Enter text" />`,
                        `<Input variant="dash" label="Dashed" placeholder="Enter text" />`,
                        `<Input variant="soft" label="Soft" placeholder="Enter text" />`,
                        `<Input variant="ghost" label="Ghost" placeholder="Enter text" />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-4">
                            <Input
                                variant="filled"
                                label="Filled"
                                placeholder="Enter text"
                                width="full"
                            />

                            <Input
                                variant="outline"
                                label="Outline"
                                placeholder="Enter text"
                                width="full"
                            />

                            <Input
                                variant="underline"
                                label="Underline"
                                placeholder="Enter text"
                                width="full"
                            />

                            <Input
                                variant="dash"
                                label="Dashed"
                                placeholder="Enter text"
                                width="full"
                            />

                            <Input
                                variant="soft"
                                label="Soft"
                                placeholder="Enter text"
                                width="full"
                            />

                            <Input
                                variant="ghost"
                                label="Ghost"
                                placeholder="Enter text"
                                width="full"
                            />
                        </div>
                    ),
                },
                {
                    id: "shape",
                    title: "Shape",
                    code: [
                        `<Input shape="square" placeholder="Square" />`,
                        `<Input shape="rounded" placeholder="Rounded" />`,
                        `<Input shape="circle" placeholder="Circle" />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-3">
                            <Input shape="square" placeholder="Square" />
                            <Input shape="rounded" placeholder="Rounded" />
                            <Input shape="circle" placeholder="Circle" />
                        </div>
                    ),
                },
                {
                    id: "variant-color",
                    title: "Variant and Color",
                    code: [
                        `<Input color="primary" variant="filled" placeholder="Primary Filled" />`,
                        `<Input color="success" variant="outline" placeholder="Success Outline" />`,
                        `<Input color="accent" variant="underline" placeholder="Accent Underline" />`,
                        `<Input color="neutral" variant="filled" placeholder="Neutral Filled" />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-3">
                            <Input
                                color="primary"
                                variant="filled"
                                placeholder="Primary Filled"
                            />
                            <Input
                                color="success"
                                variant="outline"
                                placeholder="Success Outline"
                            />
                            <Input
                                color="accent"
                                variant="underline"
                                placeholder="Accent Underline"
                            />
                            <Input
                                color="neutral"
                                variant="filled"
                                placeholder="Neutral Filled"
                            />
                        </div>
                    ),
                },
            ],
        },
        {
            id: "layout",
            label: "Layout and Alignment",
            examples: [
                {
                    id: "width",
                    title: "Width",
                    code: [
                        `<Input width="auto" placeholder="Auto Width" />`,
                        `<Input width="full" placeholder="Full Width" />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full flex-col items-start gap-3">
                            <Input width="auto" placeholder="Auto Width" />
                            <Input width="full" placeholder="Full Width" />
                        </div>
                    ),
                },
                {
                    id: "value-position",
                    title: "Value and Placeholder Alignment",
                    code: [
                        `<Input valuePosition="left" placeholder="Left Aligned" />`,
                        `<Input valuePosition="center" placeholder="Center Aligned" />`,
                        `<Input valuePosition="right" placeholder="Right Aligned" />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-3">
                            <Input
                                width="full"
                                valuePosition="left"
                                placeholder="Left Aligned"
                            />
                            <Input
                                width="full"
                                valuePosition="center"
                                placeholder="Center Aligned"
                            />
                            <Input
                                width="full"
                                valuePosition="right"
                                placeholder="Right Aligned"
                            />
                        </div>
                    ),
                },
                {
                    id: "value-position-values",
                    title: "Value Alignment with Values",
                    code: [
                        `<Input width="full" value="Left aligned value" valuePosition="left" readOnly />`,
                        `<Input width="full" value="Centered value" valuePosition="center" readOnly />`,
                        `<Input width="full" value="Right aligned value" valuePosition="right" readOnly />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-3">
                            <Input
                                width="full"
                                value="Left aligned value"
                                valuePosition="left"
                                readOnly
                            />
                            <Input
                                width="full"
                                value="Centered value"
                                valuePosition="center"
                                readOnly
                            />
                            <Input
                                width="full"
                                value="Right aligned value"
                                valuePosition="right"
                                readOnly
                            />
                        </div>
                    ),
                },
            ],
        },
        {
            id: "icons",
            label: "Icons",
            examples: [
                {
                    id: "icon",
                    title: "Icons",
                    code: [
                        `<Input icon="lucide:user" placeholder="Username" />`,
                        `<Input icon="lucide:mail" type="email" placeholder="Email address" />`,
                        `<Input icon="lucide:lock" type="password" placeholder="Password" />`,
                        `<Input icon="lucide:search" iconPosition="right" placeholder="Search..." />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-3">
                            <Input icon="lucide:user" placeholder="Username" />
                            <Input
                                icon="lucide:mail"
                                type="email"
                                placeholder="Email address"
                            />
                            <Input
                                icon="lucide:lock"
                                type="password"
                                placeholder="Password"
                            />
                            <Input
                                icon="lucide:search"
                                iconPosition="right"
                                placeholder="Search..."
                            />
                        </div>
                    ),
                },
                {
                    id: "icon-position",
                    title: "Icon Position",
                    code: [
                        `<Input width="full" icon="lucide:search" iconPosition="left" placeholder="Left Icon" />`,
                        `<Input width="full" icon="lucide:search" iconPosition="right" placeholder="Right Icon" />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-3">
                            <Input
                                width="full"
                                icon="lucide:search"
                                iconPosition="left"
                                placeholder="Left Icon"
                            />
                            <Input
                                width="full"
                                icon="lucide:search"
                                iconPosition="right"
                                placeholder="Right Icon"
                            />
                        </div>
                    ),
                },
                {
                    id: "icon-color",
                    title: "Icons with Colors",
                    code: [
                        `<Input color="primary" icon="lucide:search" placeholder="Primary Search" />`,
                        `<Input color="success" icon="lucide:check-circle" placeholder="Verified" />`,
                        `<Input color="error" icon="lucide:alert-circle" placeholder="Invalid value" />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-3">
                            <Input
                                color="primary"
                                icon="lucide:search"
                                placeholder="Primary Search"
                            />
                            <Input
                                color="success"
                                icon="lucide:check-circle"
                                placeholder="Verified"
                            />
                            <Input
                                color="error"
                                icon="lucide:alert-circle"
                                placeholder="Invalid value"
                            />
                        </div>
                    ),
                },
            ],
        },
        {
            id: "states",
            label: "States",
            examples: [
                {
                    id: "active",
                    title: "Active",
                    code: [
                        `<Input label="Default" placeholder="Default state" />`,
                        `<Input label="Active" active placeholder="Active state" />`,
                        `<Input label="Primary Active" active color="primary" placeholder="Primary active" />`,
                        `<Input label="Success Active" active color="success" placeholder="Success active" />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-4">
                            <Input label="Default" placeholder="Default state" />
                            <Input label="Active" active placeholder="Active state" />
                            <Input
                                label="Primary Active"
                                active
                                color="primary"
                                placeholder="Primary active"
                            />
                            <Input
                                label="Success Active"
                                active
                                color="success"
                                placeholder="Success active"
                            />
                        </div>
                    ),
                },
                {
                    id: "disabled",
                    title: "Disabled",
                    code: [
                        `<Input disabled label="Disabled" placeholder="Disabled input" />`,
                        `<Input disabled value="Disabled value" readOnly />`,
                        `<Input disabled icon="lucide:lock" placeholder="Locked input" />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-3">
                            <Input
                                disabled
                                label="Disabled"
                                placeholder="Disabled input"
                            />
                            <Input disabled value="Disabled value" readOnly />
                            <Input
                                disabled
                                icon="lucide:lock"
                                placeholder="Locked input"
                            />
                        </div>
                    ),
                },
                {
                    id: "loading",
                    title: "Loading",
                    code: [
                        `<Input loading label="Loading" placeholder="Please wait..." />`,
                        `<Input loading icon="lucide:search" placeholder="Searching..." />`,
                        `<Input loading color="success" width="full" placeholder="Processing..." />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-3">
                            <Input
                                loading
                                label="Loading"
                                placeholder="Please wait..."
                            />
                            <Input
                                loading
                                icon="lucide:search"
                                placeholder="Searching..."
                            />
                            <Input
                                loading
                                color="success"
                                width="full"
                                placeholder="Processing..."
                            />
                        </div>
                    ),
                },
                {
                    id: "readonly",
                    title: "Read Only",
                    code: [
                        `<Input label="Username" value="sonar-user" readOnly />`,
                        `<Input label="Account ID" value="ACC-10248" readOnly icon="lucide:copy" iconPosition="right" />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-4">
                            <Input
                                label="Username"
                                value="sonar-user"
                                readOnly
                            />
                            <Input
                                label="Account ID"
                                value="ACC-10248"
                                readOnly
                                icon="lucide:copy"
                                iconPosition="right"
                            />
                        </div>
                    ),
                },
            ],
        },
        {
            id: "validation",
            label: "Validation and Helper Text",
            examples: [
                {
                    id: "helper-text",
                    title: "Helper Text",
                    code: [
                        `<Input label="Username" helpMessage="Choose a unique username." placeholder="Username" />`,
                        `<Input label="Password" type="password" helpMessage="Must contain at least 8 characters." placeholder="Password" />`,
                        `<Input label="Email" type="email" helpMessage="We'll never share your email." placeholder="you@example.com" />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-4">
                            <Input
                                label="Username"
                                helpMessage="Choose a unique username."
                                placeholder="Username"
                            />
                            <Input
                                label="Password"
                                type="password"
                                helpMessage="Must contain at least 8 characters."
                                placeholder="Password"
                            />
                            <Input
                                label="Email"
                                type="email"
                                helpMessage="We'll never share your email."
                                placeholder="you@example.com"
                            />
                        </div>
                    ),
                },
                {
                    id: "error",
                    title: "Error States",
                    code: [
                        `<Input label="Email" type="email" error placeholder="Enter email" />`,
                        `<Input label="Username" error errorMessage="Username is required." placeholder="Enter username" />`,
                        `<Input label="Password" type="password" error errorMessage="Password must contain at least 8 characters." placeholder="Enter password" />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-4">
                            <Input
                                label="Email"
                                type="email"
                                error
                                placeholder="Enter email"
                            />
                            <Input
                                label="Username"
                                error
                                errorMessage="Username is required."
                                placeholder="Enter username"
                            />
                            <Input
                                label="Password"
                                type="password"
                                error
                                errorMessage="Password must contain at least 8 characters."
                                placeholder="Enter password"
                            />
                        </div>
                    ),
                },
                {
                    id: "error-priority",
                    title: "Error and Helper Text",
                    code: [
                        `<Input width="full" label="Email" type="email" errorMessage="Your email is not valid." helpMessage="Enter a valid email address." placeholder="you@example.com" />`,
                    ].join("\n"),
                    component: (
                        <div className="w-full max-w-sm">
                            <Input
                                width="full"
                                label="Email"
                                type="email"
                                errorMessage="Your email is not valid."
                                helpMessage="Enter a valid email address."
                                placeholder="you@example.com"
                            />
                        </div>
                    ),
                },
                {
                    id: "required",
                    title: "Required and Length Constraints",
                    code: [
                        `<Input width="full" label="Username" required minLength={3} maxLength={20} helpMessage="3–20 characters." placeholder="Choose a username" />`,
                        `<Input width="full" label="Email" type="email" required placeholder="you@example.com" />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-4">
                            <Input
                                width="full"
                                label="Username"
                                required
                                minLength={3}
                                maxLength={20}
                                helpMessage="3–20 characters."
                                placeholder="Choose a username"
                            />
                            <Input
                                width="full"
                                label="Email"
                                type="email"
                                required
                                placeholder="you@example.com"
                            />
                        </div>
                    ),
                },
            ],
        },
        {
            id: "combinations",
            label: "Combinations",
            examples: [
                {
                    id: "email-presets",
                    title: "Email Input Presets",
                    code: [
                        `<Input label="Email" type="email" variant="underline" width="full" icon="lucide:mail" iconPosition="right" placeholder="Enter email..." helpMessage="Enter a valid email." />`,
                        `<Input label="Email" type="email" variant="underline" width="full" icon="lucide:mail" iconPosition="right" placeholder="Enter email..." errorMessage="Your email is not valid." />`,
                        `<Input label="Email" type="email" color="success" variant="filled" width="full" loading icon="lucide:mail" iconPosition="right" placeholder="Checking email..." helpMessage="Verifying your email." />`,
                        `<Input label="Email" type="email" color="neutral" variant="outline" width="full" icon="lucide:mail" iconPosition="left" placeholder="Enter email..." helpMessage="Enter a valid email." />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-md flex-col gap-5">
                            <Input
                                label="Email"
                                type="email"
                                variant="underline"
                                width="full"
                                icon="lucide:mail"
                                iconPosition="right"
                                placeholder="Enter email..."
                                helpMessage="Enter a valid email."
                            />
                            <Input
                                label="Email"
                                type="email"
                                variant="underline"
                                width="full"
                                icon="lucide:mail"
                                iconPosition="right"
                                placeholder="Enter email..."
                                errorMessage="Your email is not valid."
                            />
                            <Input
                                label="Email"
                                type="email"
                                color="success"
                                variant="filled"
                                width="full"
                                loading
                                icon="lucide:mail"
                                iconPosition="right"
                                placeholder="Checking email..."
                                helpMessage="Verifying your email."
                            />
                            <Input
                                label="Email"
                                type="email"
                                color="neutral"
                                variant="outline"
                                width="full"
                                icon="lucide:mail"
                                iconPosition="left"
                                placeholder="Enter email..."
                                helpMessage="Enter a valid email."
                            />
                        </div>
                    ),
                },
                {
                    id: "search",
                    title: "Search",
                    code: [
                        `<Input width="full" icon="lucide:search" iconPosition="left" placeholder="Search components..." />`,
                        `<Input width="full" variant="underline" icon="lucide:search" iconPosition="right" placeholder="Search documentation..." />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-lg flex-col gap-3">
                            <Input
                                width="full"
                                icon="lucide:search"
                                iconPosition="left"
                                placeholder="Search components..."
                            />
                            <Input
                                width="full"
                                variant="underline"
                                icon="lucide:search"
                                iconPosition="right"
                                placeholder="Search documentation..."
                            />
                        </div>
                    ),
                },
                {
                    id: "authentication",
                    title: "Authentication Form",
                    code: [
                        `<Input width="full" label="Email" type="email" icon="lucide:mail" placeholder="you@example.com" required />`,
                        `<Input width="full" label="Password" type="password" icon="lucide:lock" placeholder="Enter password" helpMessage="At least 8 characters." required />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-4">
                            <Input
                                width="full"
                                label="Email"
                                type="email"
                                icon="lucide:mail"
                                placeholder="you@example.com"
                                required
                            />
                            <Input
                                width="full"
                                label="Password"
                                type="password"
                                icon="lucide:lock"
                                placeholder="Enter password"
                                helpMessage="At least 8 characters."
                                required
                            />
                        </div>
                    ),
                },
                {
                    id: "form-validation",
                    title: "Form Validation",
                    code: [
                        `<Input width="full" label="Full Name" required placeholder="Enter your name" />`,
                        `<Input width="full" label="Email" type="email" error errorMessage="Please enter a valid email." placeholder="Enter your email" />`,
                    ].join("\n"),
                    component: (
                        <div className="flex w-full max-w-sm flex-col gap-4">
                            <Input
                                width="full"
                                label="Full Name"
                                required
                                placeholder="Enter your name"
                            />
                            <Input
                                width="full"
                                label="Email"
                                type="email"
                                error
                                errorMessage="Please enter a valid email."
                                placeholder="Enter your email"
                            />
                        </div>
                    ),
                }
            ],
        },
    ],
};

const components: ComponentDefinition[] = [
    buttonComponent,
    InputComponent
];

export default function ButtonPlayground() {
    const [selectedComponentId, setSelectedComponentId] =
        useState("button");

    const [copiedId, setCopiedId] = useState<string | null>(null);

    const selectedComponent = components.find(
        (component) => component.id === selectedComponentId,
    );

    async function copyCode(id: string, code: string) {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedId(id);

            window.setTimeout(() => {
                setCopiedId((current) =>
                    current === id ? null : current,
                );
            }, 1500);
        } catch (error) {
            console.error("Failed to copy code:", error);
        }
    }

    return (
        <div className="h-screen overflow-hidden bg-base-100 text-base-content">
            <header className="relative z-30 h-16 border-b border-base-300 bg-base-100">
                <div className="flex h-full items-center justify-between px-5 sm:px-8">
                    <a
                        href="#top"
                        className="text-xl font-bold tracking-tight"
                    >
                        sonar<span className="text-primary">UI</span>
                    </a>

                    <span className="rounded-full border border-base-300 px-3 py-1 text-xs text-base-content/60">
                        Component Library
                    </span>
                </div>
            </header>

            <div
                id="top"
                className="grid h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)]"
            >
                <aside className="hidden h-full overflow-hidden border-r border-base-300 bg-base-100 p-5 lg:block">
                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-base-content/50">
                        Components
                    </p>

                    <nav className="space-y-1">
                        {components.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() =>
                                    setSelectedComponentId(item.id)
                                }
                                className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                                    selectedComponentId === item.id
                                        ? "bg-primary/10 text-primary"
                                        : "text-base-content/70 hover:bg-base-200"
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                <main className="h-full min-w-0 overflow-y-auto overscroll-contain p-5 sm:p-8 lg:p-10">
                    {selectedComponent && (
                        <>
                            <div className="mb-10 border-b border-base-300 pb-8">
                                <div className="mb-3 flex items-center gap-2 text-sm text-base-content/50">
                                    <span>Components</span>
                                    <span>/</span>
                                    <span>{selectedComponent.label}</span>
                                </div>

                                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                    {selectedComponent.label}
                                </h1>
                            </div>

                            {selectedComponent.id === "button" ? (
                                <ButtonLiveEditor />
                            ) : selectedComponent.id === "text-input" ? (
                                <InputLiveEditor />
                            ) : null}

                            <div className="space-y-12">
                                {selectedComponent.groups.map((group) => (
                                    <section key={group.id}>
                                        <div className="mb-4">
                                            <h2 className="text-xl font-semibold tracking-tight">
                                                {group.label}
                                            </h2>
                                        </div>

                                        <div className="space-y-4">
                                            {group.examples.map((example) => {
                                                const copyId = `${selectedComponent.id}-${group.id}-${example.id}`;

                                                return (
                                                    <article
                                                        key={example.id}
                                                        className="overflow-hidden rounded-xl border border-base-300"
                                                    >
                                                        <div className="flex min-h-32 flex-wrap items-center gap-4 bg-base-100 p-6 sm:p-8">
                                                            {example.component}
                                                        </div>

                                                        <div className="border-t border-base-300 bg-base-200">
                                                            <div className="flex items-center justify-between border-b border-base-300 px-5 py-3">
                                                                <span className="text-xs font-medium tracking-wider text-base-content/50">
                                                                    {example.title}.tsx
                                                                </span>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        copyCode(
                                                                            copyId,
                                                                            example.code,
                                                                        )
                                                                    }
                                                                    className="rounded-lg border border-base-300 bg-base-100 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-base-300"
                                                                >
                                                                    {copiedId === copyId
                                                                        ? "Copied!"
                                                                        : "Copy code"}
                                                                </button>
                                                            </div>

                                                            <SyntaxHighlighter
                                                                language="tsx"
                                                                style={oneDark}
                                                                showLineNumbers
                                                                wrapLongLines
                                                                customStyle={{
                                                                    margin: 0,
                                                                    padding: "1.25rem",
                                                                    fontSize: "0.875rem",
                                                                    lineHeight: "1.75rem",
                                                                    borderRadius: "0.5rem",
                                                                    background: "transparent",
                                                                }}
                                                                codeTagProps={{
                                                                    style: {
                                                                        fontFamily: "inherit",
                                                                    },
                                                                }}
                                                            >
                                                                {example.code}
                                                            </SyntaxHighlighter>
                                                        </div>
                                                    </article>
                                                );
                                            })}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
