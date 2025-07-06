import { FC, useEffect } from "react";
import clsx from "clsx";
import { Modal } from "../modal";
import { Button } from "../button";
import { EmojiSelector } from "../emoji-selector";
import { Input } from "../input";
import Dropdown from "rc-dropdown";
import { DropdownType, useCreateListModal } from "./use-create-list-modal";
import { Tooltip } from "../tooltip";
import { listColors } from "../../constants";
import { Check } from "react-bootstrap-icons";
import { isEmpty } from "lodash";

import "./create-list-modal.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateListModal: FC<Props> = (props) => {
  const { isOpen, onClose } = props;

  const { form, dropdownOpened, setDropdownOpened } = useCreateListModal({
    onClose,
  });

  const isEmojiOpened = dropdownOpened === DropdownType.Emoji;
  const isColorOpened = dropdownOpened === DropdownType.Color;

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Modal
      className="create-list-modal"
      backdropClassName="create-list-backdrop"
      animationName="zoomIn"
      title="Create new list"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <form.Field name="icon">
              {(field) => (
                <Dropdown
                  trigger={["click"]}
                  overlay={
                    <div className="p-4 w-48 shadow-card rounded-lg bg-white">
                      <EmojiSelector
                        onEmojiSelect={(emoji) => {
                          field.handleChange(emoji);
                          setDropdownOpened(undefined);
                        }}
                      />
                    </div>
                  }
                  visible={isEmojiOpened}
                  onVisibleChange={(visible) =>
                    setDropdownOpened(visible ? DropdownType.Emoji : undefined)
                  }
                >
                  <Tooltip overlay="Choose list icon">
                    <div
                      className={clsx(
                        "flex-center flex-shrink-0 w-4 h-4 rounded-md bg-gray-100 hover-bg-gray-200",
                        isEmojiOpened &&
                          "outline-2 outline-solid outline-blue-500"
                      )}
                    >
                      <span className="pointer-events-none">
                        {field.state.value}
                      </span>
                    </div>
                  </Tooltip>
                </Dropdown>
              )}
            </form.Field>
            <form.Field name="color">
              {(field) => (
                <Dropdown
                  trigger={["click"]}
                  overlay={
                    <div className="p-4 shadow-card rounded-lg bg-white">
                      <div className="grid grid-cols-5 gap-3">
                        {listColors.map((color) => {
                          const isActive = field.state.value === color;

                          return (
                            <div
                              className={clsx(
                                "w-7 h-6 flex-center transition-all cursor-pointer rounded-sm active-scale-95 hover-opacity-70",
                                isActive && "border-2 border-blue-400"
                              )}
                              key={color}
                              style={{ background: color }}
                              onClick={() => field.handleChange(color)}
                            >
                              <Check
                                width={24}
                                height={24}
                                color="white"
                                className={clsx(
                                  "transition-all",
                                  isActive ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  }
                  visible={isColorOpened}
                  onVisibleChange={(visible) =>
                    setDropdownOpened(visible ? DropdownType.Color : undefined)
                  }
                >
                  <Tooltip overlay="Choose list color">
                    <div
                      className={clsx(
                        "flex-center flex-shrink-0 w-4 h-4 rounded-md border-2 border-gray-200 bg-gray-100 hover-bg-gray-200",
                        isColorOpened &&
                          "outline-2 outline-solid outline-blue-500"
                      )}
                      style={{
                        background: field.state.value,
                      }}
                    />
                  </Tooltip>
                </Dropdown>
              )}
            </form.Field>
            <form.Field
              name="label"
              validators={{
                onChange: ({ value }) =>
                  !value
                    ? "A list name is required"
                    : value.length < 3
                    ? "List name must be at least 3 characters"
                    : undefined,
              }}
            >
              {(field) => (
                <Input
                  placeholder="List name"
                  className={clsx(
                    "w-full",
                    !isEmpty(field.state.meta.errors) &&
                      "outline-2 outline-solid outline-red-400"
                  )}
                  onChange={(event) => field.handleChange(event.target.value)}
                  value={field.state.value}
                  autoFocus
                  required
                />
              )}
            </form.Field>
          </div>
          <Button
            size="md"
            color="primary"
            variant="contained"
            htmlType="submit"
            onClick={form.handleSubmit}
            rounded
          >
            Create list
          </Button>
        </div>
      </div>
    </Modal>
  );
};
