import EventEmitter from "eventemitter3";
import {
  AppState,
  SearchDatePresetsEnum,
  SearchSortPresetsEnum,
} from "./types";
import {
  getDayRange,
  getMonthRange,
  getWeekRange,
  getYearRange,
} from "./utils";

export const eventEmitter = new EventEmitter();

export enum AppEvents {
  RefetchLists = "refetch-list",
  UpdateList = "update-list",

  RefetchTasks = "refetch-tasks",

  RefetchActivities = "refetch-activities",
  RefetchActivitiesLogs = "refetch-activities-logs",
  LogActivityOpened = "log-activity",
  StartActivity = "start-activity",
  UpdateActivityTray = "update-activity-tray",

  RefetchCounters = "refetch-counters",
  RefetchCounterLogs = "refetch-counter-logs",

  TrayOpened = "tray-opened",
}

export const datePresets: Record<
  SearchDatePresetsEnum,
  { from?: Date; to?: Date }
> = {
  [SearchDatePresetsEnum.Yesterday]: getDayRange(-1),
  [SearchDatePresetsEnum.Today]: getDayRange(0),
  [SearchDatePresetsEnum.Tomorrow]: getDayRange(1),
  [SearchDatePresetsEnum.ThisWeek]: getWeekRange(),
  [SearchDatePresetsEnum.ThisMonth]: getMonthRange(),
  [SearchDatePresetsEnum.ThisYear]: getYearRange(),
  [SearchDatePresetsEnum.AllTime]: {},
};

/* Priorities */
export enum TaskPriorityEnum {
  Critical = "critical",
  High = "high",
  Medium = "medium",
  Low = "low",
}

export const defaultAppState: AppState = {
  activeList: null,
  datePreset: SearchDatePresetsEnum.AllTime,
  sortPreset: SearchSortPresetsEnum.DateCreated,
  activeTaskId: null,
  openedModal: null,
};

export const listColors = [
  "#61bd4f",
  "#f2d600",
  "#ff9e1a",
  "#eb5a46",
  "#c278e0",
  "#0279c0",
  "#00c2e0",
  "#52e898",
  "#ff78cc",
  "#355263",
  "#b3bec4",
];

export const NO_LIST_LABEL = "No List";
