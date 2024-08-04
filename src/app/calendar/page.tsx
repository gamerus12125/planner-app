"use client";
import { Calendar } from "@/components/calendar/calendar";
import Database from "@tauri-apps/plugin-sql";
import { useEffect } from "react";
import { DayEvent } from "@/types/types";

const CalendarPage = () => {
  useEffect(() => {
    Database.load("sqlite:test.db").then((db) => {
      const strings = [
        "name",
        "date",
        "color",
        "description",
        "type",
        "repeat",
      ];
      const ints = ["id", "rootEventId"];
      const reals = ["start", "end"];
      db.select("PRAGMA table_info(events)").then((res: any) => {
        res.forEach((element: any) => {
          if (
            !(element.name in strings && element.type === "TEXT") &&
            !(element.name in ints && element.type === "INTEGER") &&
            !(element.name in reals && element.type === "REAL")
          ) {
            db.execute("DROP TABLE events").then(() => {
              db.execute(
                "CREATE TABLE events (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL, date TEXT, start REAL, end REAL, color TEXT, description TEXT, type TEXT NOT NULL, rootEventId INTEGER, repeat TEXT)"
              );
            });
          }
        });
      });
      db.select(
        `SELECT * FROM sqlite_master WHERE type='table' AND name='events'`
      )
        .then((res: unknown) => {
          if (!(res as any)[0])
            db.execute(
              "CREATE TABLE events (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL, date TEXT, start REAL, end REAL, color TEXT, description TEXT, type TEXT NOT NULL, rootEventId INTEGER, repeat TEXT)"
            );
        })
        .catch((err) =>
          db.execute(
            "CREATE TABLE events (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL, date TEXT, start REAL, end REAL, color TEXT, description TEXT, type TEXT NOT NULL, rootEventId INTEGER, repeat TEXT)"
          )
        );
    });
  }, []);

  return <Calendar />;
};

export default CalendarPage;
