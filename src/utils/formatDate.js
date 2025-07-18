import dayjs from "dayjs";

export default function formatDate(date, format = "MMM D, YYYY h:mm A") {
  if (!date) return "N/A";
  return dayjs(date).format(format);
}
