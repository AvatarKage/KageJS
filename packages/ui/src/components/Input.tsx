import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { regexes } from "@kagejs/utilities";

import type {
    Size,
    Color,
    Variant,
    Shape,
    Width,
    Aspect,
    HozPos,
    Pos,
    Depth
} from "../../types/common.type.js";

import {
    activeRingStyles,
    getColorVariantStyles,
    iconPositionStyles,
    iconSizeStyles,
    getDepthStyles,
    textPositionStyles,
    shapeStyles,
    sizeStyles
} from "../scripts/styles.js";

interface Props
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        "color" | "size" | "width" | "onError"
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
    depth?: Depth;
    active?: boolean;
    loading?: boolean;
    error?: boolean;
    errorMessage?: string;
    helpMessage?: string;
    backgroundColor?: string;
    textColor?: string;
    validate?: boolean;
    regex?: RegExp;
    onError?: (isInvalid: boolean) => void;
}

export default function Input({
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
    depth = "flat",
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
    onChange,
    onError,
    value,
    defaultValue,
    backgroundColor,
    textColor,
    validate = true,
    regex,
    ...props
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [isFocused, setIsFocused] = useState(false);
    const [hasBlurred, setHasBlurred] = useState(false);

    const [inputValue, setInputValue] = useState(
        String(value ?? defaultValue ?? "")
    );

    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const currentValue = value !== undefined
        ? String(value ?? "")
        : inputValue;

    const isValidColor = (value: string): boolean =>
        typeof CSS !== "undefined" 
        && CSS.supports("color", value)
    ;

    const inputValidators: Partial<Record<string, {
        validate: (value: string) => boolean;
        message: string;
    }>> = {
        email: {
            validate: (value) => regexes.email.test(value),
            message: "Please enter a valid email address."
        },
        password: {
            validate: (value) => regexes.password.test(value),
            message: "Password must contain at least 8 characters."
        },
        url: {
            validate: (value) => regexes.url.test(value),
            message: "Please enter a valid URL."
        },
        tel: {
            validate: (value) => regexes.tel.test(value),
            message: "Please enter a valid telephone number."
        },
        number: {
            validate: (value) => regexes.number.test(value),
            message: "Please enter a valid number."
        },
        color: {
            validate: isValidColor,
            message: "Please enter a valid CSS color."
        }
    };

    const validator = inputValidators[type];

    const isInvalid =
        validate &&
        hasBlurred &&
        Boolean(currentValue) &&
        (
            regex
                ? !regex.test(currentValue)
                : Boolean(validator) && !validator!.validate(currentValue)
        );

    const validationMessage = isInvalid
        ? errorMessage || (regex
            ? "Invalid input format."
            : validator?.message || "Invalid input format.")
        : errorMessage;

    const hasError = error || Boolean(errorMessage) || isInvalid;

    useEffect(() => {
        onError?.(hasError);
    }, [hasError, onError]);

    const isDisabled = disabled || loading;
    const isSearch = type === "search";

    const styleColorOverride = {
        ...(backgroundColor && {
            "--color-primary": backgroundColor,
        }),
        ...(textColor && {
            "--color-primary-content": textColor,
        }),
    } as React.CSSProperties;

    const baseWrapperStyles = [
        "input relative inline-flex min-w-0 items-center gap-2",
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

    const displayIcon = isSearch && !icon
        ? "lucide:search"
        : icon;

    const iconElement =
        typeof displayIcon === "string" ? (
            <Icon
                icon={displayIcon}
                width={iconSizeStyles[size]}
                height={iconSizeStyles[size]}
                className="shrink-0"
                aria-hidden="true"
            />
        ) : displayIcon ? (
            <span
                className="inline-flex shrink-0 items-center justify-center"
                aria-hidden="true"
            >
                {displayIcon}
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
        getDepthStyles(depth, color, variant),
        width === "full" ? "w-full" : "w-auto",
        (active || isFocused) && !isDisabled && activeRingStyles[hasError ? "error" : color]
    ].filter(Boolean).join(" ");

    const combinedInputStyles = [
        baseInputStyles,
        width === "full" ? "w-full" : "w-auto",
        textPositionStyles[valuePosition],
        className
    ].filter(Boolean).join(" ");

    const describedBy = [
        hasError && validationMessage ? errorId : undefined,
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
                    htmlFor={inputId}
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
                style={{
                    ...style,
                    ...styleColorOverride,
                }}
            >
                {iconPosition === "left" && visibleIcon}

                <input
                    {...props}
                    ref={inputRef}
                    id={inputId}
                    type={type}
                    value={value !== undefined ? value : inputValue}
                    defaultValue={undefined}
                    disabled={isDisabled}
                    className={combinedInputStyles}
                    onChange={(event) => {
                        setInputValue(event.target.value);
                        onChange?.(event);
                    }}
                    onFocus={(event) => {
                        setIsFocused(true);
                        onFocus?.(event);
                    }}
                    onBlur={(event) => {
                        setIsFocused(false);
                        setHasBlurred(true);
                        onBlur?.(event);
                    }}
                    aria-busy={loading || undefined}
                    aria-invalid={hasError || undefined}
                    aria-describedby={describedBy}
                />

                {isSearch && currentValue && !isDisabled && (
                    <button
                        type="button"
                        onClick={() => {
                            if (value === undefined) {
                                setInputValue("");
                            }

                            const input = inputRef.current;

                            if (!input) return;

                            const setter = Object.getOwnPropertyDescriptor(
                                HTMLInputElement.prototype,
                                "value"
                            )?.set;

                            setter?.call(input, "");

                            input.dispatchEvent(
                                new Event("input", { bubbles: true })
                            );

                            input.focus();
                        }}
                        className="inline-flex shrink-0 items-center justify-center opacity-60 hover:opacity-100"
                        aria-label="Clear search"
                    >
                        <Icon
                            icon="lucide:x"
                            width={iconSizeStyles[size]}
                            height={iconSizeStyles[size]}
                            className="cursor-pointer"
                        />
                    </button>
                )}

                {iconPosition === "right" && !isSearch && visibleIcon}
            </div>

            {hasError && validationMessage ? (
                <span
                    id={errorId}
                    className="text-xs text-error"
                    role="alert"
                >
                    {validationMessage}
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
