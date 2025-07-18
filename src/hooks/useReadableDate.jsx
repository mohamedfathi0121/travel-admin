import { useMemo } from "react";
import dayjs from "dayjs";

// Optional: For better formatting
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);

/**
 * Custom Hook to format a date into a readable format
 * @param {string|Date} date - The ISO date string or Date object
 * @param {string} format - (Optional) The dayjs format (default: "LLL")
 * @returns {string} - Formatted readable date
 */
export default function useReadableDate(date, format = "LLL") {
  return useMemo(() => {
    if (!date) return "N/A";
    return dayjs(date).format(format);
  }, [date, format]);
}
