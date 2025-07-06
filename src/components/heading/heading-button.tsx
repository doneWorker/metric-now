import clsx from "clsx";
import { forwardRef, HTMLAttributes, ReactNode, Ref } from "react";

type Props = HTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
};

export const HeadingButton = forwardRef(
  (props: Props, ref: Ref<HTMLButtonElement>) => {
    const { children, icon, className, onClick } = props;

    const isOpen = className === "rc-dropdown-open";

    return (
      <button
        ref={ref}
        className={clsx(
          "h-4 flex items-center gap-3 px-4 py-2 flex-shrink-0 text-sm rounded-lg bg-white shadow-lg transition-all outline-2 outline-solid active-scale-95 hover-opacity-70",
          isOpen ? "outline-blue-500" : "outline-transparent"
        )}
        onClick={onClick}
      >
        {icon && (
          <span className="flex p-3 rounded-md bg-gray-100">{icon}</span>
        )}
        <span className="label">{children}</span>
      </button>
    );
  }
);
