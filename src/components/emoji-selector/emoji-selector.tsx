import { FC, useCallback, useEffect, useState } from "react";
import { Search } from "react-bootstrap-icons";
import { EmojiItem, groupEmojisWithKey } from "./utils";
import { GroupList } from "./group-list";
import { groupToIcon } from "./constants";
import { Input } from "../input";

import iconsJson from "./emoji.json";
import "./emoji-selector.scss";

const groupedEmojis = groupEmojisWithKey(iconsJson);
const allIcons = Object.values(groupedEmojis).flat();

type Props = {
  onEmojiSelect?: (emoji: string) => void;
};

export const EmojiSelector: FC<Props> = (props) => {
  const { onEmojiSelect } = props;

  const [activeGroup, setActiveGroup] = useState(Object.keys(groupToIcon)[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [icons, setIcons] = useState<EmojiItem[]>([]);

  const handleGroupClick = useCallback((groupName: string) => {
    setActiveGroup(groupName);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const filteredEmojis = allIcons.filter((emoji) =>
        emoji.name.toLowerCase().includes(searchLower)
      );
      setIcons(filteredEmojis);
    } else {
      const emojis = groupedEmojis[activeGroup] ?? [];
      setIcons(emojis);
    }
  }, [activeGroup, searchQuery]);

  return (
    <div className="emoji-selector">
      <Input
        startIcon={<Search />}
        placeholder="Search for emojis"
        onChange={(event) => setSearchQuery(event.target.value)}
      />
      {icons.length === 0 && (
        <p className="w-full text-center">No emojis found</p>
      )}
      <div className="icons">
        {icons.map((icon) => (
          <button
            type="button"
            key={icon.name}
            className="icon"
            title={icon.name}
            onClick={() => {
              onEmojiSelect?.(icon.emoji);
            }}
          >
            {icon.emoji}
          </button>
        ))}
      </div>
      <GroupList activeGroup={activeGroup} onGroupClick={handleGroupClick} />
    </div>
  );
};
