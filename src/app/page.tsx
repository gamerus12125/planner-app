'use client';

import { TaskList } from '@/components/tasks-page/task-list';
import { checkTable } from '@/utils/funcs/check-table';
import Database from '@tauri-apps/plugin-sql';
import { useEffect } from 'react';

const createTasksTable = (db: Database) => {
  db.execute(
    'CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL, creationDate TEXT NOT NULL, deadlineDate TEXT, hasDeadline INTEGER, isComplete INTEGER, color TEXT, description TEXT, priority TEXT)',
  ).catch(err => {
    console.log(err);
  });
};

const createEventsTable = (db: Database) => {
  db.execute(
    'CREATE TABLE events (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL, date TEXT, start REAL, end REAL, color TEXT, description TEXT, repeat TEXT)',
  );
};

const CategoriesPage = () => {
  useEffect(() => {
    Database.load('sqlite:test.db').then(db => {
      let strings = ['name', 'creationDate', 'deadlineDate', 'color', 'description', 'priority'];
      let ints = ['id', 'isComplete', 'hasDeadline'];

      checkTable(db, 'tasks', createTasksTable, strings, ints);

      strings = ['name', 'date', 'color', 'description', 'repeat'];
      ints = ['id'];
      const reals = ['start', 'end'];

      checkTable(db, 'events', createEventsTable, strings, ints, reals);
    });
  }, []);
  return <TaskList />;
};

export default CategoriesPage;
