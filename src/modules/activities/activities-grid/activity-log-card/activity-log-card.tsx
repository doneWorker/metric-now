import clsx from "clsx";
import { format } from "date-fns";
import Dropdown from "rc-dropdown";
import { CSSProperties, FC, useState } from "react";
import { Clock } from "react-bootstrap-icons";
import { EditActivityLog } from "../../edit-activity-log";

type Props = {
  id: string;
  title?: string;
  note?: string;
  color?: string;
  style?: CSSProperties;
  dateStart?: string;
  dateEnd?: string;
};

export const ActivityLogCard: FC<Props> = (props) => {
  const { id, title, note, style, color, dateStart, dateEnd } = props;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      animation="slide-up"
      overlay={<EditActivityLog id={id} onClose={() => setIsOpen(false)} />}
      visible={isOpen}
      onVisibleChange={setIsOpen}
    >
      <div
        data-id={id}
        className={clsx(
          "absolute px-1 left-0 top-0 w-full",
          !dateEnd && "in-progress"
        )}
        style={style}
      >
        <div
          className="w-full h-full flex flex-col space-between border-1 border-white min-h-18px p-1 rounded-lg text-sm cursor-pointer transition-all text-white outline-2 outline-solid hover-outline-blue-500"
          style={{
            backgroundColor: color ?? "var(--blue-500)",
          }}
        >
          <div className="font-medium">{title ?? note}</div>
          <div className="flex gap-2">
            <div>
              <Clock />
            </div>
            <div>
              {dateStart && <span>{format(new Date(dateStart), "h:mm")}</span>}
              {dateEnd && <span> - {format(new Date(dateEnd), "h:mm")}</span>}
            </div>
          </div>
        </div>
      </div>
    </Dropdown>
  );
};
