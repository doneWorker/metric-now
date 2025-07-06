import { FC } from "react";
import { Bool } from "../../../../types";
import { StarFill } from "react-bootstrap-icons";

type Props = {
  title: string;
  favorite?: Bool;
};

export const TaskTitle: FC<Props> = (props) => {
  const { title, favorite } = props;

  return (
    <span className="title w-full ellipsis">
      {title}
      {!!favorite && (
        <StarFill
          className="absolute ml-4 flex-shrink-0 text-yellow-500"
          width={16}
          height={16}
        />
      )}
    </span>
  );
};
