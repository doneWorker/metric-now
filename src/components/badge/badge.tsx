import { FC } from "react";

import "./badge.scss";

type Props = {
  count: number;
};

export const Badge: FC<Props> = (props) => {
  const { count } = props;

  return <div className="badge">{count}</div>;
};
