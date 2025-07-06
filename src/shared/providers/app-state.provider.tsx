import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { defaultAppState } from "../../constants";

type AppStateContextType = {
  state: typeof defaultAppState;
  setState: Dispatch<React.SetStateAction<typeof defaultAppState>>;
};
export const AppStateContext = createContext(
  null as unknown as AppStateContextType
);

export const AppStateProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const [state, setState] = useState(defaultAppState);

  const value = useMemo(() => ({ state, setState }), [state, setState]);

  return <AppStateContext value={value}>{children}</AppStateContext>;
};

export const useAppState = () => {
  const context = useContext(AppStateContext);

  if (context === undefined) {
    throw new Error("useAppState must be used within a AppStateProvider");
  }

  return context;
};
