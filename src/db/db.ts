import Database from "@tauri-apps/plugin-sql";
import {
  writeTextFile,
  BaseDirectory,
  readTextFile,
} from "@tauri-apps/plugin-fs";
import { open } from "@tauri-apps/plugin-dialog";
import { listColors } from "../constants";
import { format } from "date-fns";

export let db: Database;

export async function bootstrapDb() {
  db = await Database.load("sqlite:todo.db");
}

export const tables = {
  lists: "lists",
  tasks: "tasks",
  counters: "counters",
  activityLogs: "task_activity_logs",
  counterLogs: "task_counter_logs",
};

export async function initDb() {
  await db.execute(
    `CREATE TABLE IF NOT EXISTS ${tables.lists} (
      id TEXT PRIMARY KEY UNIQUE,
      label TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      dateCreated TEXT NOT NULL,
      themeId TEXT DEFAULT 'default'
    );
    `
  );

  const existing = await db.select<{ count: number }[]>(
    `SELECT COUNT(*) as count FROM ${tables.lists}`
  );
  if (existing[0].count === 0) {
    await db.execute(`
  INSERT INTO ${tables.lists}(id, label, icon, color, dateCreated) VALUES
    ('home', 'Home', '🏠', '${listColors[0]}', datetime('now')),
    ('sport', 'Sport', '⚽️', '${listColors[1]}', datetime('now')),
    ('favorites', 'Favorites', '⭐', '${listColors[2]}', datetime('now'));
  `);
  }

  await db.execute(
    `CREATE TABLE IF NOT EXISTS ${tables.tasks} (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT 0,
      completedDate TEXT,
      favorite BOOLEAN DEFAULT 0,
      taskType TEXT DEFAULT 'regular', -- 'regular' | 'counter' | 'activity'
      listId TEXT,
      priority TEXT,
      scheduledDate TEXT,
      estimation INTEGER DEFAULT 0,
      timeSpent INTEGER DEFAULT 0,
      repeat TEXT, -- e.g. "daily", "weekly", "monthly"
      dateCreated TEXT NOT NULL,
      FOREIGN KEY (listId) REFERENCES ${tables.lists}(id) ON DELETE CASCADE
    )`
  );

  await db.execute(
    `CREATE TABLE IF NOT EXISTS ${tables.activityLogs} (
      id TEXT PRIMARY KEY,
      datetimeStart TEXT,
      datetimeEnd TEXT,
      taskId TEXT,
      note TEXT,
      color TEXT,
      dateCreated TEXT,
      FOREIGN KEY (taskId) REFERENCES ${tables.tasks}(id) ON DELETE CASCADE
    )`
  );

  await db.execute(
    `CREATE TABLE IF NOT EXISTS ${tables.counters} (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      dateCreated TEXT NOT NULL
    )`
  );

  await db.execute(
    `CREATE TABLE IF NOT EXISTS ${tables.counterLogs} (
      id TEXT PRIMARY KEY,
      counterId TEXT NOT NULL,
      date TEXT NOT NULL,
      value INTEGER NOT NULL,
      FOREIGN KEY (counterId) REFERENCES ${tables.counters}(id) ON DELETE CASCADE
    )`
  );
}

export async function resetDb() {
  await db.execute(`DROP TABLE IF EXISTS ${tables.lists}`);
  await db.execute(`DROP TABLE IF EXISTS ${tables.tasks}`);
  await db.execute(`DROP TABLE IF EXISTS ${tables.activityLogs}`);
  await db.execute(`DROP TABLE IF EXISTS ${tables.counters}`);
  await db.execute(`DROP TABLE IF EXISTS ${tables.counterLogs}`);
}

export async function closeDb() {
  await db.close();
}

export async function exportDatabase() {
  const data = {
    lists: await db.select(`SELECT * FROM ${tables.lists}`),
    tasks: await db.select(`SELECT * FROM ${tables.tasks}`),
    activityLogs: await db.select(`SELECT * FROM ${tables.activityLogs}`),
    counters: await db.select(`SELECT * FROM ${tables.counters}`),
    counterLogs: await db.select(`SELECT * FROM ${tables.counterLogs}`),
  };

  const contents = JSON.stringify(
    { version: 1, exportedAt: new Date().toISOString(), data },
    null,
    2
  );

  const date = new Date();
  const fileName = `dump.${format(date, "dd-MM-yyyy")}.${date.getTime()}.json`;

  await writeTextFile(fileName, contents, {
    baseDir: BaseDirectory.Download,
  });
}

async function insertToDatabase(backupData: Record<string, any[string]>) {
  const {
    lists = [],
    tasks = [],
    activityLogs = [],
    counters = [],
    counterLogs = [],
  } = backupData;

  const insert = (table: string, rows: any[]) =>
    Promise.all(
      rows.map((row) => {
        const keys = Object.keys(row);
        const columns = keys.map((k) => `"${k}"`).join(", ");
        const placeholders = keys.map(() => "?").join(", ");
        const values = keys.map((k) => row[k]);

        const sql = `INSERT OR REPLACE INTO "${table}" (${columns}) VALUES (${placeholders})`;
        return db.execute(sql, values);
      })
    );

  await insert(tables.lists, lists);
  await insert(tables.tasks, tasks);
  await insert(tables.activityLogs, activityLogs);
  await insert(tables.counters, counters);
  await insert(tables.counterLogs, counterLogs);
}

export async function importFromJsonFile() {
  const filePath = await open({
    multiple: false,
    filters: [
      {
        name: "JSON Files",
        extensions: ["json"],
      },
    ],
  });

  if (!filePath || Array.isArray(filePath)) {
    console.warn("No file selected");
    return;
  }

  try {
    const fileContent = await readTextFile(filePath);
    const parsed = JSON.parse(fileContent);
    await insertToDatabase(parsed.data);
    location.reload();
  } catch (error) {
    console.error("Failed to import file:", error);
  }
}
