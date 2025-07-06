import { JsonEmojiItem } from "../../types";

export type EmojiItem = JsonEmojiItem & { emoji: string };

export function groupEmojisWithKey(input: Record<string, JsonEmojiItem>) {
  const grouped: Record<string, EmojiItem[]> = {};

  for (const [emoji, data] of Object.entries(input)) {
    const group = data.group || "Ungrouped";

    if (!grouped[group]) {
      grouped[group] = [];
    }

    grouped[group].push({
      ...data,
      emoji,
    });
  }

  return grouped;
}
