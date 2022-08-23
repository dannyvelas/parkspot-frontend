export const dateToYmd = (date: Date): string => {
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  return date.toISOString().split("T")[0];
};

export const capitalize = (s: string): string => {
  if (s === "") return s;

  return s.charAt(0).toUpperCase() + s.slice(1);
};
