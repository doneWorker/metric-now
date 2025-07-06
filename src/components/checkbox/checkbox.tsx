import { FC, HTMLAttributes } from "react";
import clsx from "clsx";

import "./checkbox.scss";
import { TaskPriorityEnum } from "../../constants";

type Props = HTMLAttributes<HTMLInputElement> & {
  priority?: TaskPriorityEnum;
} & Pick<HTMLAttributes<HTMLLabelElement>, "onClick">;

export const Checkbox: FC<Props> = (props) => {
  const { defaultChecked, title, className, priority, onClick, ...rest } =
    props;

  return (
    <label
      className={clsx(
        "checkbox",
        className,
        priority && `priority-${priority}`
      )}
      onClick={onClick}
      title={title}
    >
      <input type="checkbox" checked={defaultChecked} {...rest} hidden />
      <span className="check" />
    </label>
  );
};
