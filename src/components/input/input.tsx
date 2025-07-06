import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { isString } from "lodash";

import "./input.scss";

type Props = InputHTMLAttributes<HTMLTextAreaElement> & {
  highlightTags?: boolean;
  startIcon?: ReactNode;
  initialValue?: string;
  value?: string;
};
export type InputRefType = {
  setInputValue: (value: React.SetStateAction<string>) => void;
};

export const Input = forwardRef((props: Props, ref: Ref<InputRefType>) => {
  const {
    className,
    highlightTags,
    startIcon,
    initialValue = "",
    value,
    onChange,
    ...rest
  } = props;

  const [inputValue, setInputValue] = useState(initialValue);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isString(value)) setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    onChange?.(e);
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        setInputValue,
      };
    },
    []
  );

  const highlight = (text: string) => {
    const pattern = /([#@][\w\d-_]+)/g;
    const escaped = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return escaped.replace(
      pattern,
      (match) => `<span class="highlight">${match}</span>`
    );
  };

  useEffect(() => {
    if (textareaRef.current && highlightRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      highlightRef.current.style.height = textareaRef.current.style.height;
    }
  }, [inputValue]);

  return (
    <div className={clsx("input hover-bg-gray-200", className)}>
      {startIcon && <div className="flex-center mr-4">{startIcon}</div>}

      <div className="relative w-full">
        {highlightTags && (
          <div
            ref={highlightRef}
            className="highlight-layer"
            dangerouslySetInnerHTML={{
              __html: highlight(inputValue) + "&nbsp;",
            }}
          />
        )}
        <textarea
          {...rest}
          ref={textareaRef}
          rows={1}
          value={inputValue}
          onChange={handleChange}
          className={clsx(highlightTags && "has-highlights")}
        />
      </div>
    </div>
  );
});
