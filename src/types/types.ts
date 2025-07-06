/*
 * Models
 */

import { TaskPriorityEnum } from "../constants";

export type Bool = 1 | 0;

export enum TaskTypeEnum {
  Regular = "regular",
  Activity = "activity",
  Counter = "counter",
}

export type Repeat = {
  unit: "day" | "week" | "month" | "year";
  weakDays?: string[]; // e.g. ["mon", "wed", "fri"]
  interval: number; // e.g. every 2 weeks
  endDate?: string; // optional end date for the repeat
  count?: number; // optional count of occurrences
};

export type ActivityLog = {
  id: string;
  taskId?: string;
  listId?: string;
  listColor?: string;
  note?: string;
  datetimeStart: string;
  datetimeEnd?: string;
};

export type ActivityLogWithTitle = ActivityLog & { title: string };

export type Task = {
  id: string;
  title: string;
  description: string;
  listId: string;
  completed: Bool;
  favorite?: Bool;
  scheduledDate?: string;
  taskType: TaskTypeEnum;
  priority?: TaskPriorityEnum;
  estimation?: number; // number of seconds
  timeSpent?: number; // number of seconds
  dateCreated: string;
};
export type JsonEmojiItem = {
  name: string;
  slug: string;
  group: string;
  skin_tone_support: boolean;
};

/*
 * App State
 */
export enum ModalType {
  CreateTodo,
  CreateList,
  LogActivity,
}
export type AppState = {
  activeList: string | null;
  datePreset: SearchDatePresetsEnum;
  sortPreset: SearchSortPresetsEnum;
  activeTaskId: string | null;
  openedModal: { id: ModalType; params?: Record<string, unknown> } | null;
};

/*
 * Search Filters
 */
export enum SearchDatePresetsEnum {
  Yesterday = "yesterday",
  Today = "today",
  Tomorrow = "tomorrow",
  ThisWeek = "this-week",
  ThisMonth = "this-month",
  ThisYear = "this-year",
  AllTime = "all-time",
}

export enum SearchSortPresetsEnum {
  DateCreated = "date-created",
  ImportantFirst = "important-first",
  Alphabet = "alphabet",
  Priority = "priority",
  ScheduledDate = "scheduled",
}

/*
 * Repeat Types
 */
export enum RepeatTypeEnum {
  Daily = "daily",
  Weekdays = "weekdays",
  Weekend = "weekend",
  Custom = "custom",
}

/*
 * Misc
 */
export type SortBy<T> = {
  column: keyof T;
  dir: "asc" | "desc";
};

export type ThemeItem = {
  id: string;
  name: string;
  bg_url: null;
  is_dark?: boolean;
};
