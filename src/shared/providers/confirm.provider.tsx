import {
  createContext,
  FC,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { ConfirmModal } from "../../components/confirm-modal";

type ConfirmParams = {
  description?: ReactNode;
  onConfirm: (result: boolean) => void;
};
type ConfirmContextType = {
  confirm: (params: ConfirmParams) => void;
};
export const ConfirmContext = createContext<ConfirmContextType>(
  null as unknown as ConfirmContextType
);

export const ConfirmProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState<ReactNode>();

  const callbackRef = useRef<(value: boolean) => void>(null);

  const confirm = useCallback(({ description, onConfirm }: ConfirmParams) => {
    setIsOpen(true);
    setDescription(description);
    callbackRef.current = onConfirm;
  }, []);

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext value={value}>
      {children}
      {isOpen && (
        <ConfirmModal
          description={description}
          onCancel={() => {
            setIsOpen(false);
            callbackRef.current?.(false);
            callbackRef.current = null;
          }}
          onConfirm={() => {
            setIsOpen(false);
            callbackRef.current?.(true);
            callbackRef.current = null;
          }}
        />
      )}
    </ConfirmContext>
  );
};

export const useConfirm = () => useContext(ConfirmContext);
