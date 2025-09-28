'use client';
import { SideBar } from '@/components/side-bar/side-bar';
import { checkTable } from '@/utils/funcs/check-table';
import { Provider } from '@/utils/providers/provider';
import { defaultWindowIcon } from '@tauri-apps/api/app';
import { Menu } from '@tauri-apps/api/menu';
import { TrayIcon, TrayIconOptions } from '@tauri-apps/api/tray';
import { getAllWindows } from '@tauri-apps/api/window';
import Database from '@tauri-apps/plugin-sql';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import './globals.css';

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
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

    const createTray = async () => {
      const menu = await Menu.new({
        items: [
          {
            id: 'open',
            text: 'Открыть',
            action: async () => {
              const windows = await getAllWindows();
              for (const window of windows) {
                await window.show();
                await window.setFocus();
              }
            },
          },
          {
            id: 'quit',
            text: 'Выход',
            action: async () => {
              const windows = await getAllWindows();
              for (const window of windows) {
                await window.close();
              }
            },
          },
        ],
      });

      const options: TrayIconOptions = {
        icon: (await defaultWindowIcon()) || undefined,
        menu,
      };
      const tray = await TrayIcon.new(options);
    };
    createTray();
  }, []);
  return (
    <html lang="ru">
      <Provider>
        <body className={inter.className}>
          <div className="grid grid-cols-[20vw_80vw]">
            <SideBar />
            {children}
          </div>
        </body>
      </Provider>
    </html>
  );
}
