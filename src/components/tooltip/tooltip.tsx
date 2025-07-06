import RCTooltip from "rc-tooltip";
import type { TooltipProps } from "rc-tooltip/lib/Tooltip";
import { FC } from "react";

type Props = TooltipProps;

export const Tooltip: FC<Props> = (props) => {
  const { children, overlay, ...rest } = props;

  return (
    <RCTooltip
      classNames={{ root: "pointer-events-none" }}
      overlay={overlay}
      showArrow={false}
      {...rest}
    >
      {children}
    </RCTooltip>
  );
};
