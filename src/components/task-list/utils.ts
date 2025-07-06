export function getDateLabel(dateString: string): {
  label: string;
  isOverdue: boolean;
} {
  const date = new Date(dateString);
  const today = new Date();
  let label = "";

  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diffInDays = Math.round(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) label = "Today";
  if (diffInDays === -1) label = "Yesterday";
  if (diffInDays === 1) label = "Tomorrow";
  if (Math.abs(diffInDays) > 1) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    label = `${yyyy}/${mm}/${dd}`;
  }

  return {
    label,
    isOverdue: false,
  };
}
