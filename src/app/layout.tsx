'use client';
import { SideBar } from '@/components/side-bar/side-bar';
import { checkTable } from '@/utils/funcs/check-table';
import { Provider } from '@/utils/providers/provider';
import { getCurrentWindow } from '@tauri-apps/api/window';
import Database from '@tauri-apps/plugin-sql';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import './globals.css';

const createTasksTable = (db: Database) => {
  db.execute(
    'CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL, creationDate TEXT NOT NULL, deadlineDate TEXT, isComplete INTEGER NOT NULL, color TEXT, description TEXT, priority TEXT)',
  ).catch(err => {
    console.log(err);
  });
};

const createEventsTable = (db: Database) => {
  db.execute(
    'CREATE TABLE events (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL, date TEXT, start REAL, end REAL, color TEXT, description TEXT, repeat TEXT)',
  );
};
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    Database.load('sqlite:test.db').then(db => {
      let strings = ['name', 'creationDate', 'deadlineDate', 'color', 'description', 'priority'];
      let ints = ['id', 'isComplete'];

      checkTable(db, 'tasks', createTasksTable, strings, ints);

      strings = ['name', 'date', 'color', 'description', 'repeat'];
      ints = ['id'];
      const reals = ['start', 'end'];

      checkTable(db, 'events', createEventsTable, strings, ints, reals);
    });

    const window = getCurrentWindow();
    window.onCloseRequested(async e => {
      e.preventDefault();
      await window.hide();
    });
  }, []);
  return (
    <html lang="ru">
      <Provider>
        <body className={inter.className}>
          <div className="grid grid-cols-[calc(20vw-16px)_calc(80vw-8px)] gap-2 p-2">
            <SideBar />
            {children}
          </div>
        </body>
      </Provider>
    </html>
  );
}
