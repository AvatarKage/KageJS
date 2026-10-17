import type { 
    Aspect,
    Color, 
    Interaction, 
    Pos, 
    Shape, 
    Size, 
    Variant
} from "../types/common.type.js";

export function getColorVariantStyles(
    color: Color,
    variant: Variant,
    {
        includeHover,
        includeActive
    } : {
        includeHover?: boolean;
        includeActive?: boolean;
    } = {}
) {
    switch(variant) {
        case "outline":
            return [
                `bg-transparent border border-${color} text-${color}`,
                includeHover && `hover:brightness-110 hover:bg-${color} hover:text-${color}-content`,
                includeActive && `active:brightness-110 active:bg-${color} active:text-${color}-content`,
            ].filter(Boolean).join(" ");

        case "underline":
            return [
                `bg-transparent border-b rounded-none border-${color} text-${color}`,
                includeHover && "hover:brightness-110",
                includeActive && "active:brightness-110",
            ].filter(Boolean).join(" ");
        
        case "dash":
            return [
                `bg-transparent border border-dashed border-${color} text-${color}`,
                includeHover && `hover:brightness-110 hover:bg-${color}/10`,
                includeHover && `active:brightness-110 active:bg-${color}/10`,
            ].filter(Boolean).join(" ");
        
        case "soft":
            return [
                `bg-${color}/10 border border-${color}/20 text-${color}`,
                includeHover && `hover:brightness-110 hover:bg-${color} hover:text-${color}-content`,
                includeActive && `active:brightness-110 active:bg-${color} active:text-${color}-content`,
            ].filter(Boolean).join(" ");
        
        case "ghost":
            return [
                `bg-transparent border border-transparent text-${color}`,
                includeHover && `hover:brightness-110 hover:bg-${color} hover:text-${color}-content`,
                includeActive && `active:brightness-110 active:bg-${color} active:text-${color}-content`,
            ].filter(Boolean).join(" ");
        
        case "link":
            return [
                `bg-transparent border border-transparent text-${color} underline-offset-4`,
                includeHover && "hover:brightness-110 hover:underline",
                includeActive && "active:brightness-110 active:underline",
            ].filter(Boolean).join(" ");

        case "filled":
        default:
            return [
                `bg-${color} border border-${color} text-${color}-content`,
                includeHover && "hover:brightness-110",
                includeActive && "active:brightness-110",
            ].filter(Boolean).join(" ");
    }
}

export const sizeStyles: Record<Size, string> = {
    xs: "py-1 px-2 text-xs min-h-6.5 min-w-6.5",
    sm: "py-1.5 px-3 text-sm min-h-8.5 min-w-8.5",
    base: "py-2 px-4 text-base min-h-10.5 min-w-10.5",
    lg: "py-2.5 px-5 text-lg min-h-12.5 min-w-12.5",
    xl: "py-3 px-6 text-xl min-h-13.5 min-w-13.5"
};

export const iconOnlySizeStyles: Record<Size, string> = {
    xs: "p-1.5",
    sm: "p-2",
    base: "p-2.5",
    lg: "p-3",
    xl: "p-3.5"
};

export const iconSizeStyles: Record<Size, string> = {
    xs: "0.875rem",
    sm: "1rem",
    base: "1.25rem",
    lg: "1.375rem",
    xl: "1.5rem"
};

export const shapeStyles: Record<Shape, string> = {
    square: "rounded-none",
    rounded: "rounded-field",
    circle: "rounded-full"
};

export const aspectStyles: Record<Aspect, string> = {
    auto: "aspect-auto",
    square: "aspect-square"
};

export const iconPositionStyles: Record<Pos, string> = {
    left: "flex-row",
    right: "flex-row",
    top: "flex-col",
    bottom: "flex-col",
    center: "flex-row"
};

export const activeRingStyles: Record<Color, string> = {
    neutral: "ring-2 ring-neutral ring-offset-2 ring-offset-base-100",
    primary: "ring-2 ring-primary ring-offset-2 ring-offset-base-100",
    secondary: "ring-2 ring-secondary ring-offset-2 ring-offset-base-100",
    accent: "ring-2 ring-accent ring-offset-2 ring-offset-base-100",
    info: "ring-2 ring-info ring-offset-2 ring-offset-base-100",
    success: "ring-2 ring-success ring-offset-2 ring-offset-base-100",
    warning: "ring-2 ring-warning ring-offset-2 ring-offset-base-100",
    error: "ring-2 ring-error ring-offset-2 ring-offset-base-100"
};

export const focusRingStyles: Record<Color, string> = {
    neutral: "enabled:focus-visible:ring-2 enabled:focus-visible:ring-neutral-content enabled:focus-visible:ring-offset-2 enabled:focus-visible:ring-offset-base-100",
    primary: "enabled:focus-visible:ring-2 enabled:focus-visible:ring-primary-content enabled:focus-visible:ring-offset-2 enabled:focus-visible:ring-offset-base-100",
    secondary: "enabled:focus-visible:ring-2 enabled:focus-visible:ring-secondary-content enabled:focus-visible:ring-offset-2 enabled:focus-visible:ring-offset-base-100",
    accent: "enabled:focus-visible:ring-2 enabled:focus-visible:ring-accent-content enabled:focus-visible:ring-offset-2 enabled:focus-visible:ring-offset-base-100",
    info: "enabled:focus-visible:ring-2 enabled:focus-visible:ring-info-content enabled:focus-visible:ring-offset-2 enabled:focus-visible:ring-offset-base-100",
    success: "enabled:focus-visible:ring-2 enabled:focus-visible:ring-success-content enabled:focus-visible:ring-offset-2 enabled:focus-visible:ring-offset-base-100",
    warning: "enabled:focus-visible:ring-2 enabled:focus-visible:ring-warning-content enabled:focus-visible:ring-offset-2 enabled:focus-visible:ring-offset-base-100",
    error: "enabled:focus-visible:ring-2 enabled:focus-visible:ring-error-content enabled:focus-visible:ring-offset-2 enabled:focus-visible:ring-offset-base-100"
};

export const textPositionStyles: Record<string, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
};

export const interactionStyles: Record<Interaction, string> = {
    none: "",
    press: "enabled:active:brightness-90",
    scale: "enabled:active:scale-[0.98]",
    offset: "enabled:active:translate-y-0.5"
};
