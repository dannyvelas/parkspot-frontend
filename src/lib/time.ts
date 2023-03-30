export const dateToYmd = (date: Date): string => {
  const offset = date.getTimezoneOffset();
  const newDate = new Date(date.getTime() - offset * 60 * 1000);
  return newDate.toISOString().split("T")[0];
};

export const tsToDate = (ts: number): string => {
  if (ts === 0) {
    return "";
  }
  const date = new Date(ts * 1000);
  const offset = date.getTimezoneOffset();
  const offset_date = new Date(date.getTime() - offset * 60 * 1000).toISOString();
  return offset_date.replace("T", " ").split(".")[0];
};

export const minimalDate = (d: Date): string => {
  return d.toLocaleDateString("en-us", { month: "short", day: "2-digit" });
};

export const detailDate = (d: Date): string => {
  return d.toLocaleDateString("en-us", {
    month: "long",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getStartOfToday = () => {
  const tempDate = new Date();
  tempDate.setHours(0, 0, 0, 0);
  return tempDate;
};

export const getEndOfTomorrow = () => {
  const tempDate = new Date();
  tempDate.setDate(tempDate.getDate() + 1);
  tempDate.setHours(23, 59, 59, 0);
  return tempDate;
};
