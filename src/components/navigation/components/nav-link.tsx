import { Link, ReactNode } from "@tanstack/react-router";
import { FC } from "react";

type Props = {
  link: string;
  title: string;
  icon: ReactNode;
};

export const NavLink: FC<Props> = (props) => {
  const { title, link, icon } = props;

  return (
    <Link
      to={link}
      activeProps={{ className: "bg-gray-100" }}
      className="flex gap-4 p-2 rounded-lg items-center text-gray-700 no-underline hover-bg-gray-100 transition-all"
    >
      <div className="w-3 h-3 flex-center rounded-lg bg-gray-200 text-gray-700">
        {icon}
      </div>
      <span>{title}</span>
    </Link>
  );
};
