export type Size =
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
;

export type Color =
    | "primary"
    | "secondary"
    | "accent"
    | "neutral"
    | "info"
    | "success"
    | "warning"
    | "error"
;

export type Variant =
    | "filled"
    | "outline"
    | "underline"
    | "dash"
    | "soft"
    | "ghost"
    | "link"
;

export type Shape =
    | "square"
    | "rounded"
    | "circle"
;

export type Width =
    | "auto"
    | "full"
;

export type Aspect =
    | "auto"
    | "square"
;

export type VerPos =
    | "top"
    | "center"
    | "bottom"
;

export type HozPos =
    | "left"
    | "center"
    | "right"
;

export type Pos = 
    | VerPos
    | HozPos
;

export type Interaction =
    | "none"
    | "press"
    | "scale"
    | "offset"
;
