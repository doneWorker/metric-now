const locale = "en-EN";

export function getMonths() {
  const months = [];

  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(i);
    months.push(date.toLocaleString(locale, { month: "long" }));
  }

  return months;
}

export function getDaysForMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const days = new Date(year, month + 1, 0).getDate();
  const startWeekDay = date.getDay();
  const prevMonthDays = new Date(year, month, 0).getDate();

  return { days, startWeekDay, prevMonthDays };
}

export function getYMD(d: Date) {
  return {
    year: d.getFullYear(),
    month: d.getMonth(),
    day: d.getDate(),
  };
}
