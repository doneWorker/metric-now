import { FC, useCallback, useLayoutEffect, useMemo } from "react";
import { TaskLists } from "../components/task-lists";
import { TaskList } from "../components/task-list";
import { Button } from "../components/button";
import { useTasks } from "../hooks/use-tasks";
import { useLists } from "../hooks/use-lists";
import { CreateTodoModal } from "../components/create-todo-modal";
import { CreateListModal } from "../components/create-list-modal";
import { Heading } from "../components/heading";
import { Background } from "../components/background";
import { initKeyboardShortcuts } from "../utils";
import { FullTaskDrawer } from "../components/full-task-drawer";
import { LogActivityModal } from "../components/log-activity-modal";
import { AppEvents, eventEmitter } from "../constants";
import { useAppState } from "../shared/providers";
import { ModalType } from "../types";
import { Aside } from "../components";

export const HomeScreen: FC = () => {
  const { state, setState } = useAppState();

  const { tasks, createTask, setTaskCompletion, removeTask, toggleFavorite } =
    useTasks({
      listId: state.activeList,
      datePreset: state.datePreset,
      sortPreset: state.sortPreset,
    });

  const { lists, removeList } = useLists();

  const activeList = useMemo(
    () => lists.find((list) => list.id === state.activeList),
    [lists, state.activeList]
  );

  const createTodoOpened = state.openedModal?.id === ModalType.CreateTodo;
  const createListOpened = state.openedModal?.id === ModalType.CreateList;
  const logActivityOpened = state.openedModal?.id === ModalType.LogActivity;

  const closeModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      openedModal: null,
    }));
  }, []);

  useLayoutEffect(() => {
    // Init keyboard shortcuts
    setTimeout(() => {
      initKeyboardShortcuts();
    }, 100);
  }, []);

  return (
    <main>
      <Background />
      <Aside>
        <TaskLists
          lists={lists}
          activeId={state.activeList}
          onClick={(listId) =>
            setState((prev) => ({
              ...prev,
              activeTaskId: null,
              activeList: listId,
            }))
          }
          onRemoveList={(listId) => {
            removeList(listId);
            setState((prev) => ({
              ...prev,
              activeList: null,
            }));
          }}
          onOpenCreateListModal={() =>
            setState((prev) => ({
              ...prev,
              openedModal: { id: ModalType.CreateList },
            }))
          }
        />
      </Aside>

      <div className="relative w-full">
        <Heading
          username="friend"
          listTitle={
            activeList ? `${activeList.icon} ${activeList.label}` : undefined
          }
        />
        <TaskList
          tasks={tasks}
          toggleTask={(taskId, completed) =>
            setTaskCompletion(taskId, completed)
          }
          toggleFavorite={toggleFavorite}
          onRemoveTask={removeTask}
          onTaskClick={(taskId) => {
            setState((prev) => ({
              ...prev,
              activeTaskId: taskId === prev.activeTaskId ? null : taskId,
            }));
            eventEmitter.emit(AppEvents.RefetchTasks);
          }}
        />
      </div>
      <Button
        className="fixed"
        style={{
          left: "50%",
          bottom: 10,
          zIndex: 99,
          minWidth: 300,
          width: "25vw",
          maxWidth: 350,
          transform: "translateX(-50%)",
        }}
        variant="contained"
        color="black"
        size="lg"
        data-hotkeys="shift+n"
        startIcon={
          <div
            style={{
              fontSize: 25,
              transition: "transform .2s",
              transform: `rotate(${createTodoOpened ? "45deg" : 0})`,
            }}
          >
            +
          </div>
        }
        endIcon={
          <div>
            <span className="flex gap-2">
              <kbd data-code="shift">⇧</kbd>
              <kbd data-code="n">N</kbd>
            </span>
          </div>
        }
        onClick={() =>
          setState((prev) => ({
            ...prev,
            openedModal:
              prev.openedModal?.id === ModalType.CreateTodo
                ? null
                : { id: ModalType.CreateTodo },
          }))
        }
        rounded
      >
        Create new task
      </Button>
      {state.activeTaskId && (
        <FullTaskDrawer
          onClose={() => setState((prev) => ({ ...prev, activeTaskId: null }))}
          taskId={state.activeTaskId}
        />
      )}
      <CreateTodoModal
        lists={lists.filter((list) => list.id !== "favorites")}
        isOpen={createTodoOpened}
        defaultListId={activeList?.id}
        onClose={closeModal}
        onSubmit={(candidate) => {
          createTask(candidate);
          closeModal();
        }}
      />
      <CreateListModal isOpen={createListOpened} onClose={closeModal} />
      <LogActivityModal isOpen={logActivityOpened} onClose={closeModal} />
    </main>
  );
};
