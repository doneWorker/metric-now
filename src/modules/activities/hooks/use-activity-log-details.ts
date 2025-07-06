import { useEffect, useState } from "react";
import { ActivityLog } from "../../../types";
import { getActivityLogRecord } from "../../../db";

export const useActivityLogDetails = (logId: string) => {
  const [details, setDetails] = useState<ActivityLog>();

  useEffect(() => {
    const fetchLog = async () => {
      const log = await getActivityLogRecord(logId);
      setDetails(log);
    };

    fetchLog();
  }, [logId]);

  return details;
};
