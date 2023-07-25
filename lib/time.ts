import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const getTimeAgo = (timestamp: string | number | Date) => {
  return dayjs().to(dayjs(timestamp));
};
