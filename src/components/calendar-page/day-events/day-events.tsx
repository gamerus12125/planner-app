'use client';
import { DayEventType } from '@/types/types';
import { hours, numbersToMonths } from '@/utils/consts';
import Database from '@tauri-apps/plugin-sql';
import { JSX, useEffect, useRef, useState } from 'react';
import { EventDetails } from '../event-details/event-details';
import { AddEventButton } from './add-event-button';

export const DayEvents = ({ date }: { date: Date }) => {
  const [events, setEvents] = useState<never[] | DayEventType[]>([]);
  const [isOpenDetails, setIsOpenDetails] = useState<DayEventType | undefined>();
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isChanged, setIsChanged] = useState(false);

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpenDetails(undefined);
    Database.load('sqlite:test.db').then(db => {
      db.select(`SELECT * FROM events WHERE date = $1 OR repeat LIKE '%${date.getDay()}%'`, [
        date.toLocaleDateString(),
      ])
        .then((res: any) => {
          setEvents(res);
        })
        .catch(error => {
          console.log(error);
        });
    });
  }, [date, isChanged]);

  const rows = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  const renderEvents = () => {
    const res: JSX.Element[] = [];

    events.forEach(event => {
      if (!event || !container.current) return;
      const start = Math.floor(event.start / 60);
      const end = Math.ceil(event.end / 60);
      const row = Math.max(...rows.slice(start, end));
      const width = 60 + 9;
      const top = 32 * row + 20 + 44 + 16 + 24 + 5;

      const left = (event.start / 60) * width + 34;
      const eventWidth = (Math.floor(event.end - event.start) / 60) * width;

      res.push(
        <div
          key={event.id}
          className={`bg-green-700 absolute hover:scale-110 hover:z-10 hover:cursor-pointer transition-all transition-discrete ${
            eventWidth < event.name.trim().length * 10 ? 'hover:w-[max-content]!' : ''
          } `}
          style={{
            left: `${left}px`,
            width: `${eventWidth}px`,
            height: '30px',
            top: `${top}px`,
            backgroundColor: event.color,
          }}
          onClick={e => {
            setIsOpenDetails(event);
            setCoords({ x: e.clientX, y: e.clientY });
          }}>
          <p className="overflow-hidden whitespace-pre">{event.name}</p>
        </div>,
      );
      for (let i = start; i < end; i++) {
        rows[i] = row + 1;
      }
    });
    return { res, row: Math.max(...rows) };
  };

  const { res, row } = renderEvents();

  return (
    <>
      <div
        ref={container}
        className="border-2 px-[30px] overflow-y-auto relative h-[250px] w-full mb-8 p-6">
        <div>
          <div className="flex gap-[100px] items-center mb-4">
            <h3 className="text-center text-xl underline underline-offset-8">
              {date.getDate()}{' '}
              {numbersToMonths[date.getMonth().toString() as keyof typeof numbersToMonths]}
            </h3>
            <AddEventButton setIsChanged={setIsChanged} />
          </div>
          <div className="flex gap-[60px] relative top-0">
            {hours.map(hour => (
              <div
                key={hour}
                className="flex flex-col gap-[5px] justify-center items-center w-[9px]">
                <span>{hour}</span>
                <div className="w-[2px] bg-gray-500" style={{ height: `${row * 50}px` }}></div>
              </div>
            ))}
          </div>
        </div>
        {res}
      </div>
      {isOpenDetails && (
        <EventDetails
          event={isOpenDetails}
          setIsOpen={setIsOpenDetails}
          x={coords.x}
          y={coords.y}
          setIsChanged={setIsChanged}
        />
      )}
    </>
  );
};
