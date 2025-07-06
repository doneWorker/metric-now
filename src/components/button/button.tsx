import { FC, HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { Color, Size, Variant } from "../../types";

import "./button.scss";

type Props = HTMLAttributes<HTMLButtonElement> & {
  htmlType?: "button" | "submit" | "reset";
  variant?: Variant;
  size?: Size;
  rounded?: boolean;
  color?: Color;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

export const Button: FC<Props> = (props) => {
  const {
    startIcon,
    variant = "contained",
    endIcon,
    className,
    children,
    rounded,
    color = "blue",
    size = "md",
    htmlType,
    ...rest
  } = props;

  return (
    <button
      type={htmlType ?? "button"}
      className={clsx(
        "button active-scale-95",
        rounded && "rounded",
        startIcon && "has-start-icon",
        color,
        size,
        variant,
        className
      )}
      {...rest}
    >
      {startIcon && <span className="start-icon flex-center">{startIcon}</span>}
      <div className="label">{children}</div>
      {endIcon && <span className="end-icon">{endIcon}</span>}
    </button>
  );
};
