import { Monaco } from "@monaco-editor/react";

export default function defineCustomTheme(monaco: Monaco) {
    monaco.editor.defineTheme("custom-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
            { token: "", foreground: "d19a66" },
            { token: "tag", foreground: "00D4FF" },
            { token: "delimiter", foreground: "abb2bf" },
            { token: "attribute.name", foreground: "FF4DA6" },
            { token: "attribute.value", foreground: "34F5A3" },
            { token: "keyword", foreground: "abb2bf" },
            { token: "string", foreground: "88ad6e" },
            { token: "number", foreground: "FFCA57" },
            { token: "comment", foreground: "64748B", fontStyle: "italic" },
            { token: "type.identifier", foreground: "d19a66" },
        ],
        colors: {
            "editor.background": "#090B16",
            "editor.foreground": "#EEF2FF",
            "editorCursor.foreground": "#00D4FF",
            "editor.selectionBackground": "#1D3B55",
            "editor.lineHighlightBackground": "#111527",
            "editorLineNumber.foreground": "#64748B",
            "editorLineNumber.activeForeground": "#00D4FF",
            "editorIndentGuide.background1": "#1D233B",
            "editorIndentGuide.activeBackground1": "#36415C",
            "editorWidget.background": "#111527",
            "editorWidget.border": "#1D233B",
            "editorSuggestWidget.background": "#111527",
            "editorSuggestWidget.foreground": "#EEF2FF",
            "editorSuggestWidget.selectedBackground": "#1D233B",
            "editorSuggestWidget.highlightForeground": "#00D4FF",
        },
    });

    monaco.editor.setTheme("custom-dark");
}
