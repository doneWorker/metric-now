import { FC, useEffect, useState } from "react";
import { useAppState } from "../../shared/providers";
import { ThemeItem } from "../../types";
import { useList } from "../../hooks/use-list";

import themesJSON from "../../assets/themes.json";

export const Background: FC = () => {
  const [theme, setTheme] = useState<ThemeItem>();

  const {
    state: { activeList },
  } = useAppState();

  const list = useList(activeList);

  useEffect(() => {
    const fetchTheme = () => {
      const foundTheme = themesJSON.find(
        (theme) => theme.id === list?.themeId
      ) as ThemeItem;
      setTheme(foundTheme);
    };

    fetchTheme();
  }, [list?.themeId]);

  useEffect(() => {
    const isDark = theme?.is_dark ?? false;
    document.body.classList[isDark ? "add" : "remove"]("dark");
  }, [theme]);

  return (
    <div
      className="fixed z-0 inset-0 bg-cover transition-all"
      style={{
        backgroundImage: theme?.bg_url ? `url(${theme.bg_url})` : "none",
      }}
    />
  );
};
