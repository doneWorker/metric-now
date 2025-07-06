import { useVirtualizer, VirtualItem } from "@tanstack/react-virtual";
import { FC, ReactNode, useRef } from "react";

type Props = {
  listHeight: number;
  itemHeight: number;
  items: unknown[];
  gap?: number;
  listClassName?: string;
  renderItem: (item: VirtualItem) => ReactNode;
};

export const VirtualList: FC<Props> = (props) => {
  const {
    listClassName,
    listHeight,
    itemHeight,
    gap = 0,
    items,
    renderItem,
  } = props;

  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight + gap,
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      className={listClassName}
      style={{
        overflow: "auto",
        height: listHeight,
      }}
    >
      <div
        className="relative w-full"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((item) => (
          <div
            key={item.key}
            data-index={item.index}
            className="absolute w-full top-0 left-0"
            ref={rowVirtualizer.measureElement}
            style={{
              height: `${item.size}px`,
              transform: `translateY(${item.start}px)`,
              marginBottom: gap,
            }}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
};
