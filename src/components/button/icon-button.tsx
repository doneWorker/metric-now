import { FC, HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { Size } from "../../types";

import "./icon-button.scss";

type Props = HTMLAttributes<Omit<HTMLButtonElement, "children">> & {
  icon: ReactNode;
  isActive?: boolean;
  size?: Size;
};

export const IconButton: FC<Props> = (props) => {
  const { icon, children, isActive, size = "md", className, ...rest } = props;

  return (
    <button
      type="button"
      className={clsx("icon-button", isActive && "active", className, size)}
      {...rest}
    >
      {icon}
    </button>
  );
};
