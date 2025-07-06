import { nanoid } from "nanoid";
import { sample } from "lodash";
import { SortBy, Task } from "../types";
import { db, tables } from "./db";
import { prepareSQLValues } from "./utils";
import { TaskPriorityEnum } from "../constants";

type DateFilter = {
  dateFrom?: string;
  dateTo?: string;
};

export type DBTasksFilter = Partial<Task> &
  DateFilter & { sort?: SortBy<Task> };

export async function getTaskRecords(filter?: DBTasksFilter) {
  const whereConds = [];
  let sortColumn: keyof Task = filter?.sort?.column ?? "dateCreated";
  let sortDirection = filter?.sort?.dir ?? "desc";

  if (filter?.listId) {
    if (filter.listId === "favorites") {
      whereConds.push(`favorite=true`);
    } else {
      whereConds.push(`listId='${filter.listId}'`);
    }
  }

  if (filter?.dateFrom) {
    whereConds.push(`scheduledDate>='${filter.dateFrom}'`);
  }

  if (filter?.dateTo) {
    whereConds.push(`scheduledDate<='${filter.dateTo}'`);
  }

  if (filter?.completed) {
    whereConds.push(`completed=${filter.completed}`);
  }

  const sqlWhere =
    whereConds.length > 0 ? "WHERE " + whereConds.join("AND ") : "";

  return await db.select<Task[]>(
    `SELECT * FROM ${tables.tasks} ${sqlWhere} ORDER BY ${sortColumn} ${sortDirection};`
  );
}

export async function getFullTaskRecord(taskId: string) {
  const tasks = await db.select<Task[]>(
    `SELECT * FROM ${tables.tasks} WHERE id=$1;`,
    [taskId]
  );
  return tasks[0];
}

export async function updateTaskRecord(taskId: string, updates: Partial<Task>) {
  const [updateSql, values] = prepareSQLValues(updates);
  await db.execute(`UPDATE ${tables.tasks} SET ${updateSql} WHERE ID = $1;`, [
    taskId,
    ...values,
  ]);
}

export async function removeTaskRecord(taskId: string) {
  await db.execute(`DELETE FROM ${tables.tasks} WHERE id=$1`, [taskId]);
}

export async function createTaskRecord(candidate: Partial<Task>) {
  await db.execute(
    `INSERT INTO ${tables.tasks} (id, title, scheduledDate, listId, priority, dateCreated) VALUES($1, $2, $3, $4, $5, DATETIME('now','localtime'));`,
    [
      nanoid(),
      candidate.title,
      candidate.scheduledDate ?? "",
      candidate.listId,
      candidate.priority,
    ]
  );
}

export function getRandomDateInTwoWeekRange(): Date {
  const now = new Date();
  const msInDay = 24 * 60 * 60 * 1000;

  // Generate a random number between -7 and +7 (inclusive)
  const offsetDays = Math.floor(Math.random() * 15) - 7;

  // Return the new Date object
  return new Date(now.getTime() + offsetDays * msInDay);
}

export async function generateTasks(total: number) {
  for (let i = 0; i < total; i++) {
    const d = getRandomDateInTwoWeekRange();

    await createTaskRecord({
      title: `Task # ${i}`,
      listId: "home",
      scheduledDate: d.toISOString(),
      priority: sample(Object.values(TaskPriorityEnum)),
    });
  }
}
