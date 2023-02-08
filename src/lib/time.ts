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

export const epochSecondsNow = () => {
  var d = new Date();
  return Math.round(d.getTime() / 1000);
};
