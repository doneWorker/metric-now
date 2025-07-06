import { FC } from "react";
import DatePicker, { DatePickerProps } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

type Props = DatePickerProps;

export const DatetimeField: FC<Props> = (props) => {
  return (
    <DatePicker
      customInput={
        <input className="h-4 px-4 bg-gray-100 border-none rounded-lg" />
      }
      dateFormat="MMMM d, yyyy h:mm aa"
      shouldCloseOnSelect={false}
      showTimeSelect
      timeFormat="p"
      timeIntervals={1}
      showTimeInput
      {...props}
    />
  );
};
