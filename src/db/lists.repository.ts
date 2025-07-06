import { prepareSQLValues } from "./utils";
import { nanoid } from "nanoid";
import { db, tables } from "./db";
import { List } from "../types";

export async function getListRecord(listId: string) {
  const lists = await db.select<List[]>(
    `SELECT * FROM ${tables.lists} WHERE id=$1;`,
    [listId]
  );
  return lists[0];
}

export async function getListRecords() {
  const lists = await db.select<List[]>(`
  SELECT
  l.id AS id,
  l.label,
  l.icon,
  l.color,
  l.themeId,
  COUNT(t.id) AS count
  FROM ${tables.lists} l
  LEFT JOIN ${tables.tasks} t ON t.listId = l.id AND t.completed = 0
  WHERE l.id != "favorites"
  GROUP BY l.id;
    `);

  const [{ favoriteCount }] = await db.select<{ favoriteCount: number }[]>(
    `SELECT COUNT(id) as favoriteCount FROM ${tables.tasks} WHERE favorite=1`
  );

  lists.unshift({
    id: "favorites",
    label: "Favorite",
    icon: "⭐️",
    count: favoriteCount,
  });

  return lists;
}

export async function createListRecord(candidate: Partial<List>) {
  await db.execute(
    `INSERT INTO ${tables.lists} (id, label, color, icon, dateCreated) VALUES ($1, $2, $3, $4, datetime('now'));`,
    [nanoid(), candidate.label, candidate.color, candidate.icon]
  );
}

export async function updateListRecord(listId: string, updates: Partial<List>) {
  const [updateSql, values] = prepareSQLValues(updates);
  await db.execute(`UPDATE ${tables.lists} SET ${updateSql} WHERE id=$1;`, [
    listId,
    ...values,
  ]);
}

export async function removeListRecord(listId: string) {
  await db.execute(`DELETE FROM ${tables.lists} WHERE id=$1;`, [listId]);
}
