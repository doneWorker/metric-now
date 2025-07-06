import { nanoid } from "nanoid";
import { ActivityLog, ActivityLogWithTitle } from "../types";
import { db, tables } from "./db";
import { prepareSQLValues } from "./utils";
import { addSeconds, startOfDay, startOfWeek } from "date-fns";
import { first } from "lodash";

export async function generateActivityLogs(total: number) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
  const secondsInDay = 24 * 60 * 60;

  const slots: { start: number; end: number; dayOffset: number }[] = [];

  let attempts = 0;
  while (slots.length < total && attempts < 5000) {
    const duration = Math.floor(Math.random() * 60 * 60) + 600; // 10min – 1hr
    const dayOffset = Math.floor(Math.random() * 7); // random day (0 = Mon ... 6 = Sun)
    const start = Math.floor(Math.random() * (secondsInDay - duration));
    const end = start + duration;

    const overlaps = slots.some(
      (slot) =>
        slot.dayOffset === dayOffset &&
        !(end <= slot.start || start >= slot.end)
    );

    if (!overlaps) {
      slots.push({ start, end, dayOffset });
    }

    attempts++;
  }

  for (let i = 0; i < slots.length; i++) {
    const { start, end, dayOffset } = slots[i];
    const dayBase = addSeconds(
      startOfDay(new Date(weekStart)),
      dayOffset * secondsInDay
    );
    const datetimeStart = addSeconds(dayBase, start).toISOString();
    const datetimeEnd = addSeconds(dayBase, end).toISOString();

    await createActivityLogRecord({
      note: `Note #${i}`,
      datetimeStart,
      datetimeEnd,
    });
  }
}

export async function getActivityLogRecord(logId: string) {
  const activities = await db.select<ActivityLog[]>(
    `SELECT * FROM ${tables.activityLogs} WHERE id=$1`,
    [logId]
  );

  return first(activities);
}

export async function createActivityLogRecord(
  candidate: Omit<ActivityLog, "id">
) {
  await db.execute(
    `INSERT INTO ${tables.activityLogs} (id, taskId, note, datetimeStart, datetimeEnd) VALUES($1, $2, $3, $4, $5);`,
    [
      nanoid(),
      candidate.taskId,
      candidate.note,
      candidate.datetimeStart,
      candidate.datetimeEnd,
    ]
  );
}

export type ActivityLogsFilter = {
  dateTimeStart?: Date;
  datetimeEnd?: Date;
  limit?: number;
};

export async function getActivityLogsRecords(filter?: ActivityLogsFilter) {
  const whereConds = [];
  let limit = filter?.limit ?? 100_000;

  if (filter?.dateTimeStart) {
    whereConds.push(`datetimeStart>='${filter.dateTimeStart.toISOString()}'`);
  }

  if (filter?.datetimeEnd) {
    whereConds.push(`datetimeEnd<='${filter.datetimeEnd.toISOString()}'`);
  }

  const sqlWhere =
    whereConds.length > 0 ? "WHERE " + whereConds.join(" AND ") : "";

  const logs = await db.select<ActivityLogWithTitle[]>(
    `SELECT l.*, a.title, c.color AS listColor, c.id as listId
    FROM ${tables.activityLogs} l
    LEFT JOIN ${tables.tasks} a ON l.taskId = a.id
    LEFT JOIN ${tables.lists} c ON a.listId = c.id
    ${sqlWhere}
    ORDER BY dateTimeEnd DESC LIMIT ${limit}`
  );

  return logs;
}

export async function getOngoingActivityLogsRecords() {
  const logs = await db.select<ActivityLogWithTitle[]>(
    `SELECT l.*, a.title FROM ${tables.activityLogs} l
    LEFT JOIN ${tables.tasks} a ON l.taskId = a.id
      WHERE datetimeEnd IS NULL
    ORDER BY dateCreated ASC`
  );

  return logs;
}

export async function updateActivityLogRecord(
  activityLogId: string,
  updates: Partial<ActivityLog>
) {
  const [updateSql, values] = prepareSQLValues(updates);

  await db.execute(
    `UPDATE ${tables.activityLogs} SET ${updateSql} WHERE id = $1;`,
    [activityLogId, ...values]
  );
}

export async function removeActivityLogRecord(activityLogId: string) {
  await db.execute(`DELETE FROM ${tables.activityLogs} WHERE id=$1`, [
    activityLogId,
  ]);
}
