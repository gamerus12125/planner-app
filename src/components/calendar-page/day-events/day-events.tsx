'use client';
import { hours, numbersToMonths } from '@/utils/consts';
import { useEventsStore } from '@/utils/providers/events-store-provider';
import { JSX } from 'react';
import { AddEventButton } from './add-event-button';
import { DayEvent } from './day-event';
import { ShowEventsListButton } from './show-events-list-button';

export const DayEvents = ({ date }: { date: Date }) => {
  const { events } = useEventsStore(state => state);

  const currentEvents = events?.filter(
    event =>
      event?.date === date.toLocaleDateString() || event.repeat?.includes(date.getDay().toString()),
  );

  const rows = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  const renderEvents = () => {
    const res: JSX.Element[] = [];

    currentEvents?.forEach(event => {
      const start = Math.floor(event.start / 60);
      const end = Math.ceil(event.end / 60);
      const row = Math.max(...rows.slice(start, end));

      res.push(<DayEvent key={event.id} event={event} row={row} />);

      for (let i = start; i < end; i++) {
        rows[i] = row + 1;
      }
    });

    return { res, row: Math.max(...rows) };
  };

  const { res, row } = renderEvents();

  return (
    <>
      <div className="border-2 rounded-lg px-[30px] overflow-y-auto relative h-[250px] mb-8 p-6">
        <div>
          <div className="flex gap-[50px] items-center mb-4">
            <h3 className="text-center text-xl underline underline-offset-8 whitespace-nowrap">
              {date.getDate()}{' '}
              {numbersToMonths[date.getMonth().toString() as keyof typeof numbersToMonths]}
            </h3>
            <AddEventButton />
            <ShowEventsListButton />
          </div>
          <div className="flex gap-[60px] relative top-0">
            {hours.map(hour => (
              <div
                key={hour}
                className="flex flex-col gap-[5px] justify-center items-center w-[9px]">
                <span>{hour}</span>
                <div className="w-0.5 bg-gray-500" style={{ height: `${row * 50}px` }}></div>
              </div>
            ))}
          </div>
        </div>
        {res}
      </div>
    </>
  );
};
