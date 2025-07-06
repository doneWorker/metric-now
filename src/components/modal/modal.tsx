import { useEffect, ReactNode, FC, HTMLAttributes } from "react";
import ReactDOM from "react-dom";
import clsx from "clsx";

import "./modal.scss";

type Props = HTMLAttributes<HTMLDivElement> & {
  isOpen: boolean;
  children: ReactNode;
  footer?: ReactNode;
  title?: string;
  backdropClassName?: string;
  animationName?: "fadeIn" | "slideIn" | "zoomIn";
  onClose: () => void;
};

export const Modal: FC<Props> = (props) => {
  const {
    isOpen,
    title,
    children,
    footer,
    backdropClassName,
    animationName = "fadeIn",
    className,
    onClose,
    ...rest
  } = props;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className={clsx("modal-backdrop", backdropClassName)}
      onClick={onClose}
    >
      <div
        className={clsx("modal-container", animationName, className)}
        onClick={(e) => e.stopPropagation()}
        {...rest}
      >
        {title && <h2 className="modal-title">{title}</h2>}
        <div>{children}</div>
        {footer && <div>{footer}</div>}
      </div>
    </div>,
    document.body
  );
};
