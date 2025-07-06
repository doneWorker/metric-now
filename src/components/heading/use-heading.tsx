import clsx from "clsx";
import { getDatePresetLabel, getSortPresetLabel } from "../../utils";
import { useCallback, useMemo } from "react";
import { SearchDatePresetsEnum, SearchSortPresetsEnum } from "../../types";
import { useAppState } from "../../shared/providers";
import { useLists } from "../../hooks/use-lists";
import { Button } from "../button";
import { Trash } from "react-bootstrap-icons";
import { AppEvents, eventEmitter } from "../../constants";
import { useList } from "../../hooks/use-list";

import themesJSON from "../../assets/themes.json";

export const useHeading = () => {
  const { state, setState } = useAppState();
  const { sortPreset, datePreset, activeList } = state;

  const { updateList, removeList } = useLists();
  const list = useList(activeList);

  const { sortPresets, datePresets } = useMemo(() => {
    return {
      sortPresets: Object.values(SearchSortPresetsEnum),
      datePresets: Object.values(SearchDatePresetsEnum),
    };
  }, []);

  const onSortPresetChange = useCallback(
    (preset: SearchSortPresetsEnum) => {
      setState((prev) => ({
        ...prev,
        sortPreset: preset,
      }));
    },
    [setState]
  );

  const onDatePresetChange = useCallback(
    (preset: SearchDatePresetsEnum) => {
      setState((prev) => ({
        ...prev,
        datePreset: preset,
      }));
    },
    [setState]
  );

  const sortOverlay = useMemo(
    () => (
      <div className="flex flex-col bg-white rounded-lg shadow-card overflow-hidden">
        {sortPresets.map((preset) => {
          const { label, icon } = getSortPresetLabel(preset);

          return (
            <button
              key={preset}
              className={clsx(
                "h-4 p-4 flex items-center gap-4 text-base hover-bg-blue-100",
                sortPreset === preset &&
                  "bg-blue-500 text-white pointer-events-none"
              )}
              onClick={() => onSortPresetChange(preset)}
            >
              <span className="flex-shrink-0">{icon}</span> {label}
            </button>
          );
        })}
      </div>
    ),
    [sortPreset, sortPresets, onSortPresetChange]
  );

  const dateOverlay = useMemo(
    () => (
      <div className="flex flex-col bg-white rounded-lg shadow-card overflow-hidden">
        {datePresets.map((preset) => (
          <button
            key={preset}
            className={clsx(
              "h-4 px-8 flex items-center gap-4 text-base hover-bg-blue-100",
              datePreset === preset &&
                "bg-blue-500 text-white pointer-events-none"
            )}
            onClick={() => onDatePresetChange(preset)}
          >
            {getDatePresetLabel(preset)}
          </button>
        ))}
      </div>
    ),
    [datePreset, datePresets, onDatePresetChange]
  );

  const settingsOverlay = useMemo(() => {
    if (!list) return null;

    return (
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-8">
        <h3>Select category background</h3>
        <div className="grid grid-cols-4 gap-2">
          {themesJSON.map((theme) => (
            <button
              key={theme.id}
              className={clsx(
                "w-10 h-8 rounded-lg overflow-hidden flex-center border border-gray-200",
                list?.id === theme.id && "active"
              )}
              title={`Theme: ${theme.name}`}
              onClick={async (event) => {
                event.stopPropagation();
                event.preventDefault();
                await updateList(list.id, { themeId: theme.id });
                eventEmitter.emit(AppEvents.UpdateList);
              }}
            >
              {theme.bg_url && (
                <img className="w-10 h-8" alt={theme.name} src={theme.bg_url} />
              )}
              {!theme.bg_url && <div>{theme.name}</div>}
            </button>
          ))}
        </div>
        <div>
          <Button
            className="w-full"
            color="red"
            variant="outlined"
            startIcon={<Trash />}
            onClick={() => removeList(list.id)}
          >
            Remove list
          </Button>
        </div>
      </div>
    );
  }, [list, updateList, removeList]);

  return {
    sortPreset,
    datePreset,
    sortOverlay,
    dateOverlay,
    settingsOverlay,
  };
};
