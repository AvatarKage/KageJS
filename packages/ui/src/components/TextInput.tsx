import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";

import type {
    Size,
    Color,
    Variant,
    Shape,
    Width,
    Aspect,
    HozPos,
    Pos
} from "../types/common.type.js";

import {
    activeRingStyles,
    getColorVariantStyles,
    iconPositionStyles,
    iconSizeStyles,
    textPositionStyles,
    shapeStyles,
    sizeStyles
} from "../scripts/styles.js";

interface Props
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        "color" | "size" | "width"
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
    valuePosition?: HozPos;
    active?: boolean;
    loading?: boolean;
    error?: boolean;
    errorMessage?: string;
    helpMessage?: string;
}

export default function TextInput({
    size = "base",
    color = "primary",
    variant = "outline",
    shape = "rounded",
    width = "auto",
    label,
    icon,
    labelPosition = "left",
    iconPosition = "left",
    valuePosition = "left",
    active = false,
    disabled = false,
    loading = false,
    error = false,
    errorMessage,
    helpMessage,
    className,
    style,
    id,
    type = "text",
    onFocus,
    onBlur,
    ...props
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [isFocused, setIsFocused] = useState(false);

    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const hasError = error || Boolean(errorMessage);
    const isDisabled = disabled || loading;

    const baseWrapperStyles = [
        "relative inline-flex min-w-0 items-center gap-2",
        "transition-[transform,filter,box-shadow,background-color,color] duration-150",
        "focus-within:outline-none",
        isDisabled ? "cursor-not-allowed opacity-50" : "cursor-text"
    ].join(" ");

    const baseInputStyles = [
        "outline-none",
        "enabled:cursor-text",
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",
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

    const combinedWrapperStyles = [
        baseWrapperStyles,
        shapeStyles[shape],
        getColorVariantStyles(hasError ? "error" : color, variant),
        sizeStyles[size],
        iconPositionStyles[iconPosition],
        width === "full" ? "w-full" : "w-auto",
        (active || isFocused) && !isDisabled && activeRingStyles[color]
    ].filter(Boolean).join(" ");

    const combinedInputStyles = [
        baseInputStyles,
        width === "full" ? "w-full" : "w-auto",
        textPositionStyles[valuePosition],
        className
    ].filter(Boolean).join(" ");

    const describedBy = [
        hasError && errorMessage ? errorId : undefined,
        helpMessage ? helperId : undefined
    ].filter(Boolean).join(" ") || undefined;

    return (
        <div
            className={[
                "inline-flex min-w-0 flex-col gap-1.5",
                width === "full" ? "w-full" : "w-fit"
            ].join(" ")}
            onMouseDown={(event) => {
                if (isDisabled) return;
                const target = event.target as HTMLElement;
                if (target.closest("label, span")) return;
                if (target !== inputRef.current) {
                    event.preventDefault();
                    inputRef.current?.focus();
                }
            }}
        >
            {label && (
                <label
                    className={[
                        "text-sm font-medium text-base-content/80",
                        textPositionStyles[labelPosition]
                    ].join(" ")}
                >
                    {label}
                </label>
            )}

            <div
                className={combinedWrapperStyles}
                style={style}
            >
                {iconPosition === "left" && visibleIcon}

                <input
                    {...props}
                    ref={inputRef}
                    id={inputId}
                    type={type}
                    disabled={isDisabled}
                    className={combinedInputStyles}
                    onFocus={(event) => {
                        setIsFocused(true);
                        onFocus?.(event);
                    }}
                    onBlur={(event) => {
                        setIsFocused(false);
                        onBlur?.(event);
                    }}
                    aria-busy={loading || undefined}
                    aria-invalid={hasError || undefined}
                    aria-describedby={describedBy}
                />

                {iconPosition === "right" && visibleIcon}
            </div>

            {hasError && errorMessage ? (
                <span
                    id={errorId}
                    className="text-xs text-error"
                    role="alert"
                >
                    {errorMessage}
                </span>
            ) : helpMessage ? (
                <span
                    id={helperId}
                    className="text-xs text-base-content/50"
                >
                    {helpMessage}
                </span>
            ) : null}
        </div>
    );
}
