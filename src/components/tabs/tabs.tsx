import { CSSProperties, FC, Key, ReactNode, useMemo, useState } from "react";
import { isFunction } from "lodash";
import clsx from "clsx";

type TitleRenderArgs = {
  isActive: boolean;
};

export type Tab = {
  key: Key;
  title: ReactNode | ((args: TitleRenderArgs) => ReactNode);
  content?: ReactNode;
  tabStyle?: CSSProperties;
};

type Props = {
  tabs: Tab[];
  defaultTabKey: Key;
  className?: string;
};

export const Tabs: FC<Props> = (props) => {
  const { tabs, defaultTabKey, className } = props;

  const [activeTabKey, setActiveTabKey] = useState(defaultTabKey);

  const activeTab = useMemo(() => {
    return tabs.find(({ key }) => key === activeTabKey);
  }, [activeTabKey, tabs]);

  return (
    <div className={clsx("tabs", className)}>
      <div className="flex gap-2">
        {tabs.map(({ key, title, tabStyle }) => (
          <span
            key={key}
            role="tab"
            className="tab-item"
            style={tabStyle}
            tabIndex={0}
            onKeyDown={() => {}}
            onClick={() => {
              setActiveTabKey(key);
            }}
          >
            {isFunction(title)
              ? title({ isActive: activeTabKey === key })
              : title}
          </span>
        ))}
      </div>
      <div className="tabs-content">{activeTab?.content}</div>
    </div>
  );
};
