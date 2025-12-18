import { DayEventType } from '@/types/types';
import Database from '@tauri-apps/plugin-sql';
import { createStore } from 'zustand/vanilla';

export type EventsState = {
  events: DayEventType[];
};

export type EventsActions = {
  addEvent: (event: Omit<DayEventType, 'id'>) => void;
  removeEvent: (id: number) => void;
  editEvent: (event: DayEventType) => void;
  initEvents: () => void;
};

export type EventsStore = EventsState & EventsActions;

export const defaultInitState: EventsState = {
  events: [],
};

export const createEventsStore = (initState: EventsState = defaultInitState) => {
  return createStore<EventsStore>()((set, get) => ({
    ...initState,
    initEvents: async () => {
      try {
        const db = await Database.load('sqlite:test.db');
        const res: unknown[] = await db.select(`SELECT * FROM events`);
        set({ events: res as DayEventType[] });
      } catch (err) {
        console.log(err);
      }
    },
    addEvent: async event => {
      const db = await Database.load('sqlite:test.db');
      try {
        await db.execute(
          `
                  INSERT INTO events (name, ${event.repeat ? 'repeat' : 'date'}, start, end, color, description)
                  VALUES ($1, $2, $3, $4, $5, $6)
                `,
          [
            event.name,
            event.repeat ? event.repeat : event.date,
            event.start,
            event.end,
            event.color,
            event.description,
          ],
        );
        get().initEvents();
      } catch (err) {
        console.log(err);
      }
    },
    editEvent: async event => {
      const db = await Database.load('sqlite:test.db');
      try {
        await db.execute(
          `UPDATE events SET name = $1, start = $2, end = $3, color = $4, description = $5, repeat = $6, date = $7 WHERE id = $8`,
          [
            event.name,
            event.start,
            event.end,
            event.color,
            event.description,
            event.repeat ? event.repeat : null,
            event.repeat ? null : event.date,
            event?.id,
          ],
        );
        get().initEvents();
      } catch (err) {
        console.log(err);
      }
    },
    removeEvent: async id => {
      const db = await Database.load('sqlite:test.db');
      await db.execute(`DELETE FROM events WHERE id = $1`, [id]);
      get().initEvents();
    },
  }));
};
