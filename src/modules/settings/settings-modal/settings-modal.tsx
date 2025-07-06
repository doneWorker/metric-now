import { FC } from "react";
import { Modal, Tooltip } from "../../../components";
import { Download, Upload } from "react-bootstrap-icons";
import { exportDatabase, importFromJsonFile } from "../../../db";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const buttonClassName =
  "w-full h-6 flex gap-6 px-4 items-center bg-gray-100 hover-bg-gray-200 transition-all rounded-lg";

export const SettingsModal: FC<Props> = (props) => {
  const { isOpen, onClose } = props;

  const handleExport = () => {
    exportDatabase();
  };

  const handleImport = () => {
    importFromJsonFile();
  };

  return (
    <Modal title="Settings" isOpen={isOpen} onClose={onClose}>
      <div className="flex p-4 gap-4">
        <Tooltip placement="top" overlay="Choose the file with data">
          <button className={buttonClassName} onClick={handleImport}>
            <Download width={18} height={18} />
            <span>Import</span>
          </button>
        </Tooltip>
        <Tooltip
          placement="top"
          overlay="Data will be saved in your 'Downloads' folder"
        >
          <button className={buttonClassName} onClick={handleExport}>
            <Upload width={18} height={18} />
            <span>Export data</span>
          </button>
        </Tooltip>
      </div>
    </Modal>
  );
};
