"use client";

import { Categories } from "@/components/tasks-page/categories/categories";
import { checkTable } from "@/utils/funcs/check-table";
import Database from "@tauri-apps/plugin-sql";
import { useEffect } from "react";

const createTasksTable = (db: Database) => {
  db.execute(
    "CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL, creationDate TEXT, deadlineDate TEXT, hasDeadline INTEGER, isComplete INTEGER, categoryId INTEGER, columnId INTEGER, color TEXT, description TEXT, priority TEXT, orderNumber INTEGER NOT NULL, FOREIGN KEY(columnId) REFERENCES columns(id) ON DELETE CASCADE)"
  ).catch((err) => {
    console.log(err);
  });
};

const createCategoriesTable = (db: Database) => {
  db.execute(
    "CREATE TABLE categories (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL, color TEXT, description TEXT)"
  ).catch((err) => {
    console.log(err);
  });
};

const createColumnsTable = (db: Database) => {
  db.execute(
    "CREATE TABLE columns (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL, color TEXT, description TEXT, categoryId INTEGER, orderNumber INTEGER NOT NULL, FOREIGN KEY(categoryId) REFERENCES categories(id) ON DELETE CASCADE)"
  );
};

const createEventsTable = (db: Database) => {
  db.execute(
    "CREATE TABLE events (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL, date TEXT, start REAL, end REAL, color TEXT, description TEXT, rootEventId INTEGER, repeat TEXT)"
  )
}

const CategoriesPage = () => {
  useEffect(() => {
    let strings = [
      "name",
      "creationDate",
      "deadlineDate",
      "color",
      "description",
      "priority",
    ];
    let ints = ["id", "isComplete", "categoryId", "columnId", "orderNumber", "hasDeadline"];
    Database.load("sqlite:test.db").then((db) => {
      checkTable(db, "tasks", createTasksTable, strings, ints);

      strings = ["name", "color", "description"];
      ints = ["id"];

      checkTable(db, "categories", createCategoriesTable, strings, ints);

      strings = ["name", "color", "description"];
      ints = ["id", "categoryId", "orderNumber"];

      checkTable(db, "columns", createColumnsTable, strings, ints);

      strings = [
        "name",
        "date",
        "color",
        "description",
        "repeat",
      ];
      ints = ["id", "rootEventId"];
      const reals = ["start", "end"];

      checkTable(db, "events", createEventsTable, strings, ints, reals);
    });
  }, []);
  return <Categories />;
};

export default CategoriesPage;
