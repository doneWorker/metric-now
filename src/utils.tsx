import Mousetrap from "mousetrap";
import {
  Bool,
  SearchDatePresetsEnum,
  SearchSortPresetsEnum,
  SortBy,
  Task,
} from "./types";
import { ReactNode } from "react";
import {
  ArrowDownUp,
  Calendar3,
  CalendarEvent,
  ExclamationOctagon,
} from "react-bootstrap-icons";
import { DBTasksFilter } from "./db";
import { datePresets } from "./constants";

import removeSound from "./assets/audio/delete.mp3";
import completeSound from "./assets/audio/complete.mp3";
import { endOfWeek, startOfWeek } from "date-fns";

export function initKeyboardShortcuts() {
  highlightKbd();
  initShortcuts();
}

function initShortcuts() {
  const $buttons: NodeListOf<HTMLButtonElement> =
    document.querySelectorAll("[data-hotkeys]");

  $buttons.forEach(($btn) => {
    const hotkeys = $btn.getAttribute("data-hotkeys");
    if (!hotkeys) return;

    Mousetrap.bind(hotkeys, function () {
      setTimeout(() => $btn.click(), 100);
    });
  });
}

function highlightKbd() {
  const $keys = document.querySelectorAll("kbd[data-code]");

  const keysToElems = Array.from($keys).reduce((acc, curr) => {
    const key = curr.getAttribute("data-code");
    if (!key) return acc;
    if (!Array.isArray(acc[key])) acc[key] = new Array();
    acc[key].push(curr);
    return acc;
  }, {} as Record<string, Element[]>);

  function resetHighlights() {
    Object.values(keysToElems)
      .flat()
      .forEach((item) => item.classList.remove("active"));
  }

  function onKeyDown({ key }: { key: string }) {
    if (!key) return;
    keysToElems[key.toLowerCase()]?.forEach(($el) =>
      $el?.classList.add("active")
    );
  }

  function onKeyUp({ key }: { key: string }) {
    if (!key) return;

    keysToElems[key.toLowerCase()]?.forEach(($el) =>
      $el?.classList.remove("active")
    );
  }

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", resetHighlights);
  window.addEventListener("visibilitychange", resetHighlights);
}

export function getDropdownPosition(
  $triggerElem: Element,
  dropdownSize?: {
    width?: number;
    height?: number;
  }
) {
  const offset = 8;
  const buttonBoundaries = $triggerElem.getBoundingClientRect();
  const buttonWidth = buttonBoundaries.width;
  const dropdownWidth = dropdownSize?.width ?? buttonBoundaries.width;

  const max = Math.max(dropdownWidth, buttonWidth);
  const min = Math.min(dropdownWidth, buttonWidth);

  const centeredLeft = max / 2 - min / 2;
  const finalLeft = Math.min(
    window.innerWidth - dropdownWidth - offset,
    buttonBoundaries.left - centeredLeft
  );

  return {
    top: buttonBoundaries.top + buttonBoundaries.height + offset,
    left: finalLeft,
  };
}

export function getDayRange(offset: number): { from: Date; to: Date } {
  const from = new Date();
  from.setHours(0, 0, 0, 0);
  from.setDate(from.getDate() + offset);

  const to = new Date(from);
  to.setHours(23, 59, 59, 999);

  return { from, to };
}

export function getWeekRange(): { from: Date; to: Date } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const from = new Date(now);
  from.setDate(now.getDate() - dayOfWeek);
  from.setHours(0, 0, 0, 0);

  const to = new Date(from);
  to.setDate(from.getDate() + 6);
  to.setHours(23, 59, 59, 999);

  return { from, to };
}

export function getMonthRange(): { from: Date; to: Date } {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  to.setHours(23, 59, 59, 999);

  return { from, to };
}

export function getYearRange(): { from: Date; to: Date } {
  const now = new Date();
  const from = new Date(now.getFullYear(), 0, 1);
  const to = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

  return { from, to };
}

export function getDatePresetLabel(preset: SearchDatePresetsEnum) {
  switch (preset) {
    case SearchDatePresetsEnum.AllTime: {
      return "All time";
    }
    case SearchDatePresetsEnum.Today: {
      return "Today";
    }
    case SearchDatePresetsEnum.Tomorrow: {
      return "Tomorrow";
    }
    case SearchDatePresetsEnum.Yesterday: {
      return "Yesterday";
    }
    case SearchDatePresetsEnum.ThisMonth: {
      return "This month";
    }
    case SearchDatePresetsEnum.ThisWeek: {
      return "This week";
    }
    case SearchDatePresetsEnum.ThisYear: {
      return "This year";
    }
    default: {
      return "Custom";
    }
  }
}

export function getSortPresetLabel(preset: SearchSortPresetsEnum): {
  icon: ReactNode;
  label: string;
} {
  switch (preset) {
    case SearchSortPresetsEnum.Alphabet: {
      return { icon: <ArrowDownUp />, label: "Alphabetically" };
    }
    case SearchSortPresetsEnum.DateCreated: {
      return { icon: <Calendar3 />, label: "Creation date" };
    }
    case SearchSortPresetsEnum.ImportantFirst: {
      return { icon: <ExclamationOctagon />, label: "Importance" };
    }
    case SearchSortPresetsEnum.Priority: {
      return { icon: <ExclamationOctagon />, label: "Priority" };
    }
    case SearchSortPresetsEnum.ScheduledDate: {
      return { icon: <CalendarEvent />, label: "Scheduled date" };
    }
  }
}

export function getTasksSortValue(preset: SearchSortPresetsEnum): SortBy<Task> {
  switch (preset) {
    case SearchSortPresetsEnum.Alphabet: {
      return { column: "title", dir: "desc" };
    }
    case SearchSortPresetsEnum.DateCreated: {
      return { column: "dateCreated", dir: "desc" };
    }
    case SearchSortPresetsEnum.ImportantFirst: {
      return { column: "favorite", dir: "desc" };
    }
    case SearchSortPresetsEnum.Priority: {
      return { column: "priority", dir: "asc" };
    }
    case SearchSortPresetsEnum.ScheduledDate: {
      return { column: "scheduledDate", dir: "desc" };
    }
  }
}

export function toggleBool(value: Bool = 0) {
  return Math.abs((value ?? 0) - 1) as Bool;
}

export function getTaskDBFilter({
  listId,
  datePreset,
  sortPreset,
}: {
  listId: string | null;
  datePreset: SearchDatePresetsEnum | null;
  sortPreset: SearchSortPresetsEnum | null;
}): DBTasksFilter {
  let filter: DBTasksFilter = listId ? { listId } : {};

  if (datePreset) {
    const dates = datePresets[datePreset];
    if (dates.from) filter.dateFrom = dates.from.toISOString();
    if (dates.to) filter.dateTo = dates.to.toISOString();
  }

  if (sortPreset) {
    filter.sort = getTasksSortValue(sortPreset);
  }

  return filter;
}

// Sound Effects
export enum SoundEffectEnum {
  Remove,
  Complete,
}

const soundEffectsToFile: Record<SoundEffectEnum, string> = {
  [SoundEffectEnum.Remove]: removeSound,
  [SoundEffectEnum.Complete]: completeSound,
};

const audioContext = new window.AudioContext();

export async function playSoundEffect(effect: SoundEffectEnum) {
  const file = soundEffectsToFile[effect];

  try {
    const response = await fetch(file);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.5;
    source.connect(gainNode).connect(audioContext.destination);

    // Play
    source.start(0);
  } catch (err) {
    console.error("Failed to play sound effect:", err);
  }
}

export function getWeekRangeByDate(date: Date): [Date, Date] {
  const rangeStart = startOfWeek(date, { weekStartsOn: 1 });
  const rangeEnd = endOfWeek(date, { weekStartsOn: 1 });

  return [rangeStart, rangeEnd];
}

export function getWeekDays(date = new Date()) {
  const days = [];
  const currentDay = date.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
  });

  for (let i = 0; i < 7; i++) {
    const d = new Date(date);
    d.setDate(date.getDate() + mondayOffset + i);
    days.push(formatter.format(d));
  }

  return days;
}

export function disableContextMenu() {
  window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
}
