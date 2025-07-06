import {
  Calendar3,
  CardText,
  ChevronDown,
  SortDown,
} from "react-bootstrap-icons";
import clsx from "clsx";
import { Tab } from "../tabs";
import { List } from "../../types";
import { Badge } from "../badge";
import { IconButton } from "../button/icon-button";
import { DatePicker } from "../date-picker";
import { Textarea } from "../textarea";
import { TaskPriorityEnum } from "../../constants";
import { priorityToClassname } from "./constants";
import { isSameDay } from "date-fns/isSameDay";
import { Tooltip } from "../tooltip";

type Params = {
  lists: List[];
  activeList?: List;
  selectedDate?: Date;
  selectedPriority?: TaskPriorityEnum;
  description?: string;
  onListChange: (listId: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onPriorityChange: (priority: TaskPriorityEnum | undefined) => void;
  onDescriptionChange: (description: string) => void;
};
export const getTabs = (params: Params): Tab[] => {
  const {
    lists,
    selectedDate,
    activeList,
    selectedPriority,
    description,
    onListChange,
    onDateChange,
    onPriorityChange,
    onDescriptionChange,
  } = params;

  return [
    {
      key: "category",
      tabStyle: {
        width: "100%",
      },
      title: ({ isActive }) => (
        <div
          className="p-4 flex h-4 space-between items-center rounded-lg"
          style={{
            border: "1px solid",
            borderColor: isActive ? "black" : "#dfdfdf",
          }}
        >
          <span>
            {activeList ? (
              <div className="flex items-center gap-4">
                <span>{activeList.icon}</span> {activeList.label}
              </div>
            ) : (
              "Choose List"
            )}
          </span>
          <ChevronDown
            style={{
              transition: "transform .5s",
              transform: `rotate(${isActive ? "180deg" : 0})`,
            }}
          />
        </div>
      ),
      content: (
        <ul className="categories">
          {lists.map(({ id, label, icon, count = 0 }) => (
            <li
              key={id}
              className="category-item"
              onKeyDown={() => {}}
              onClick={() => onListChange(id)}
            >
              <span>{icon}</span>
              <span className="w-full">{label}</span>
              <Badge count={count} />
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: "date",
      title: ({ isActive }) => (
        <Tooltip overlay="Set specific date" placement="top">
          <div className="relative">
            <span
              className={clsx(
                "absolute dot z-3 r-0 bg-primary scale-0 transition-all",
                selectedDate && "scale-100"
              )}
            />
            <IconButton isActive={isActive} icon={<Calendar3 />} />
          </div>
        </Tooltip>
      ),
      content: (
        <DatePicker
          defaultDate={selectedDate}
          onChange={(date) => {
            onDateChange(
              selectedDate && isSameDay(date, selectedDate) ? undefined : date
            );
          }}
        />
      ),
    },
    {
      key: "priority",
      title: ({ isActive }) => (
        <Tooltip overlay="Set priority" placement="top">
          <div className="relative">
            <span
              className={clsx(
                "absolute dot z-3 r-0 bg-primary scale-0 transition-all",
                selectedPriority && "scale-100"
              )}
            />
            <IconButton isActive={isActive} icon={<SortDown />} />
          </div>
        </Tooltip>
      ),
      content: (
        <div className="pt-4 pb-0">
          {Object.values(TaskPriorityEnum).map((priority: TaskPriorityEnum) => (
            <div
              key={priority}
              className={clsx(
                "priority flex items-center gap-3 px-4 py-2 rounded-sm",
                priorityToClassname[priority],
                priority === selectedPriority && "active"
              )}
              onClick={() =>
                onPriorityChange(
                  priority === selectedPriority ? undefined : priority
                )
              }
            >
              <span className="dot" />
              {priority}
            </div>
          ))}
          <hr />
        </div>
      ),
    },
    {
      key: "description",
      title: ({ isActive }) => (
        <div className="relative">
          <span
            className={clsx(
              "absolute dot z-3 r-0 bg-primary scale-0 transition-all",
              description && "scale-100"
            )}
          />
          <Tooltip overlay="Add description" placement="top">
            <IconButton isActive={isActive} icon={<CardText />} />
          </Tooltip>
        </div>
      ),
      content: (
        <Textarea
          defaultValue={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          className="w-full p-3 my-2"
          name="description"
          placeholder="Add description"
        />
      ),
    },
  ];
};
