import { FC } from "react";
import { differenceInMinutes } from "date-fns";
import { PlusCircle } from "react-bootstrap-icons";
import { Modal } from "../modal";
import { useLogActivityModal } from "./use-log-activity-modal";
import { DatetimeField } from "../datetime-field";
import { Button } from "../button";
import { Textarea } from "../textarea";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const LogActivityModal: FC<Props> = (props) => {
  const { isOpen, onClose } = props;

  const { form, title } = useLogActivityModal(onClose);

  return (
    <Modal
      title={`Log activity for ${title}`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form className="flex flex-col px-4 gap-4">
        <form.Field name="datetimeEnd">
          {(field) => (
            <div className="flex space-between items-center">
              <label className="w-full">Time start</label>
              <DatetimeField
                selected={field.state.value}
                required
                onChange={(date) => {
                  field.handleChange(date ?? field.state.value);
                }}
              />
            </div>
          )}
        </form.Field>
        <form.Field name="datetimeStart">
          {(field) => (
            <div className="flex space-between items-center">
              <label className="w-full">Time end</label>
              <DatetimeField
                selected={field.state.value}
                minDate={form.state.values.datetimeStart}
                required
                onChange={(date) => {
                  field.handleChange(date ?? field.state.value);
                }}
              />
            </div>
          )}
        </form.Field>
        <form.Subscribe
          selector={(state) => [
            state.values.datetimeStart,
            state.values.datetimeEnd,
          ]}
        >
          {([from, to]) => {
            const totalMinutes = differenceInMinutes(from, to);
            const hours = Math.round(totalMinutes / 60) ?? 0;
            const minutes = totalMinutes % 60;

            return (
              <div className="flex space-between items-center">
                <label>Duration</label>
                <div className="h-4 px-4 bg-gray-100 flex items-center rounded-lg">
                  {`${hours}h ${minutes}m`}
                </div>
              </div>
            );
          }}
        </form.Subscribe>
        <form.Field name="note">
          {(field) => (
            <Textarea
              placeholder="Note"
              className="w-full bg-gray-100 p-4 border-none rounded-lg resize-none"
              value={field.state.value}
              rows={4}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          )}
        </form.Field>
        <div className="flex justify-end">
          <Button
            startIcon={<PlusCircle />}
            variant="contained"
            onClick={() => form.handleSubmit()}
          >
            Log activity
          </Button>
        </div>
      </form>
    </Modal>
  );
};
