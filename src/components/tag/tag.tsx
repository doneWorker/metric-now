import { FC, HTMLAttributes, ReactNode } from "react";

import "./tag.scss";

type Props = HTMLAttributes<HTMLDivElement> & { children: ReactNode };

export const Tag: FC<Props> = (props) => {
  const { children, ...rest } = props;

  return (
    <div className="tag" {...rest}>
      {children}
    </div>
  );
};
