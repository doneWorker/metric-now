import { nanoid } from "nanoid";
import { format } from "date-fns";
import { db, tables } from "./db";
import { Counter, CounterLog } from "../types";
import { prepareSQLValues } from "./utils";

export async function createCounterRecord(candidate: Partial<Counter>) {
  await db.execute(
    `INSERT INTO ${tables.counters} (id, name, dateCreated) VALUES($1, $2, DATETIME('now','localtime'));`,
    [nanoid(), candidate.name]
  );
}

export async function updateCounterRecord(
  counterId: string,
  updates: Partial<Counter>
) {
  const [updateSql, values] = prepareSQLValues(updates);

  await db.execute(
    `UPDATE ${tables.counters} SET ${updateSql} WHERE ID = $1;`,
    [counterId, ...values]
  );
}

export async function getCounterRecords() {
  return await db.select<Counter[]>(`SELECT * FROM ${tables.counters}`);
}

export async function removeCounterRecord(counterId: string) {
  await db.execute(`DELETE FROM ${tables.counters} WHERE id=$1;`, [counterId]);
}

/* Log records */
type CounterLogsFilters = {
  dateFrom?: string;
  dateTo?: string;
};
export async function getCounterLogRecords(filter: CounterLogsFilters) {
  const whereConds = [];

  if (filter?.dateFrom) {
    whereConds.push(`date>='${filter.dateFrom}'`);
  }

  if (filter?.dateTo) {
    whereConds.push(`date<='${filter.dateTo}'`);
  }

  const sqlWhere =
    whereConds.length > 0 ? "WHERE " + whereConds.join(" AND ") : "";

  return await db.select<CounterLog[]>(
    `SELECT * FROM ${tables.counterLogs} ${sqlWhere}`
  );
}

export async function getCounterLogRecord(date: string, counterId: string) {
  const logs = await db.select<CounterLog[]>(
    `SELECT * FROM ${tables.counterLogs} WHERE date=$1 AND counterId=$2`,
    [date, counterId]
  );

  return logs[0];
}

export async function updateCounterLogRecord(
  counterId: string,
  date: string,
  value: number
) {
  const counterLog = await getCounterLogRecord(date, counterId);

  if (counterLog) {
    await db.execute(
      `UPDATE ${tables.counterLogs} SET value=$1 WHERE ID = $2;`,
      [value, counterLog.id]
    );

    return;
  }

  await db.execute(
    `INSERT INTO ${tables.counterLogs} (id, counterId, date, value) VALUES($1, $2, $3, $4);`,
    [nanoid(), counterId, date, value]
  );
}

// Helper: formats a JS Date to `YYYY-MM-DD`
function formatDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

// Main generator
export async function generateCountersWithLogs({
  total = 5,
  withLogs = true,
  daysBack = 7,
}: {
  total?: number;
  withLogs?: boolean;
  daysBack?: number;
}) {
  for (let i = 0; i < total; i++) {
    const name = `Counter #${i + 1}`;
    const counterId = nanoid();

    // Create the counter
    await db.execute(
      `INSERT INTO ${tables.counters} (id, name, dateCreated) VALUES($1, $2, DATETIME('now','localtime'));`,
      [counterId, name]
    );

    if (withLogs) {
      // Add logs for past N days
      for (let d = 0; d < daysBack; d++) {
        const date = new Date();
        date.setDate(date.getDate() - d);

        const value = Math.floor(Math.random() * 100); // random value 0–99
        const formatted = formatDate(date);

        await db.execute(
          `INSERT INTO ${tables.counterLogs} (id, counterId, date, value) VALUES($1, $2, $3, $4);`,
          [nanoid(), counterId, formatted, value]
        );
      }
    }
  }
}
