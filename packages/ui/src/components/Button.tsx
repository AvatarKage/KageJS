import React from "react";
import { Icon } from "@iconify/react";

import type {
    Size,
    Color,
    Variant,
    Shape,
    Width,
    Aspect,
    HozPos,
    Pos,
    Interaction
} from "../../types/common.type.js";

import {
    activeRingStyles,
    aspectStyles,
    focusRingStyles,
    getColorVariantStyles,
    iconOnlySizeStyles,
    iconPositionStyles,
    iconSizeStyles,
    interactionStyles,
    textPositionStyles,
    shapeStyles,
    sizeStyles
} from "../scripts/styles.js";

interface Props extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "color" | "size"
> {
    size?: Size;
    color?: Color;
    variant?: Variant;
    shape?: Shape;
    width?: Width;
    aspect?: Aspect;
    label?: string;
    icon?: string | React.ReactNode;
    labelPosition?: HozPos;
    iconPosition?: Exclude<Pos, "center">;
    active?: boolean;
    loading?: boolean;
    interaction?: Interaction;
}

export default function Button({
    size = "base",
    color = "primary",
    variant = "filled",
    shape = "rounded",
    width = "auto",
    aspect = "auto",
    label,
    icon,
    labelPosition = "center",
    iconPosition = "left",
    active = false,
    disabled = false,
    loading = false,
    interaction = "press",
    children,
    className,
    style,
    type = "button",
    ...props
}: Props) {
    const content = children ?? label;
    const isIconOnly = !content && Boolean(icon);

    const isDisabled = disabled || loading;
    const isVertical = iconPosition === "top" || iconPosition === "bottom";

    const baseStyles = [
        "relative inline-flex items-center justify-center gap-2 font-medium select-none",
        "transition-[transform,filter,box-shadow,background-color,color] duration-150",
        "focus-visible:outline-none",
        focusRingStyles[color],
        "enabled:cursor-pointer",
        "disabled:cursor-not-allowed disabled:opacity-50"
    ].join(" ");

    const iconElement =
        typeof icon === "string" ? (
            <Icon
                icon={icon}
                width={iconSizeStyles[size]}
                height={iconSizeStyles[size]}
                className="shrink-0"
                aria-hidden="true"
            />
        ) : icon ? (
            <span
                className="inline-flex shrink-0 items-center justify-center"
                aria-hidden="true"
            >
                {icon}
            </span>
        ) : null;

    const loadingElement = (
        <Icon
            icon="svg-spinners:ring-resize"
            width={iconSizeStyles[size]}
            height={iconSizeStyles[size]}
            className="shrink-0"
            aria-hidden="true"
        />
    );

    const visibleIcon = loading ? loadingElement : iconElement;

    const combinedStyles = [
        baseStyles,
        shapeStyles[shape],
        aspectStyles[aspect],
        getColorVariantStyles(color, variant, {
            includeHover: !isDisabled
        }),
        isIconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],
        interactionStyles[interaction],
        !isIconOnly ? iconPositionStyles[iconPosition] : "",
        width === "full" ? "w-full" : "w-auto",
        isIconOnly ? "justify-center" : "",
        active && !isDisabled ? activeRingStyles[color] : "",
        className
    ].filter(Boolean).join(" ");

    return (
        <button
            {...props}
            className={combinedStyles}
            type={type}
            disabled={isDisabled}
            style={style}
            aria-busy={loading || undefined}
            aria-pressed={active || undefined}
            aria-label={
                isIconOnly
                    ? props["aria-label"] ?? label
                    : props["aria-label"]
            }
        >
            {isIconOnly ? (
                visibleIcon
            ) : (
                <>
                    {(iconPosition === "left" ||
                      iconPosition === "top") &&
                        visibleIcon}

                    <span
                        className={[
                            "min-w-0",
                            width === "full" && !isVertical
                                ? "flex-1"
                                : "",
                            !isVertical
                                ? textPositionStyles[labelPosition]
                                : "text-center"
                        ]
                            .filter(Boolean)
                            .join(" ")}
                    >
                        {content}
                    </span>

                    {(iconPosition === "right" ||
                      iconPosition === "bottom") &&
                        visibleIcon}
                </>
            )}
        </button>
    );
}
