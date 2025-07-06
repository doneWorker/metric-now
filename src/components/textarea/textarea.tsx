import { FC, TextareaHTMLAttributes } from "react";
import clsx from "clsx";

import "./textarea.scss";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea: FC<Props> = (props) => {
  const { className, ...rest } = props;

  return (
    <textarea
      className={clsx(
        "textarea p-3 border-none rounded-lg bg-gray-100 hover-bg-gray-200",
        className
      )}
      {...rest}
    />
  );
};
