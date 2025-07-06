import { FC, ReactNode } from "react";
import { Modal } from "../modal";
import { Button } from "../button";

type Props = {
  description?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
};

const defaultDescription = "Are you sure you want to proceed?";

export const ConfirmModal: FC<Props> = (props) => {
  const { description = defaultDescription, onConfirm, onCancel } = props;

  return (
    <Modal isOpen={true} onClose={onCancel}>
      <h2>Confirm your action</h2>
      <p className="py-4">{description}</p>
      <div className="flex justify-end gap-2">
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};
