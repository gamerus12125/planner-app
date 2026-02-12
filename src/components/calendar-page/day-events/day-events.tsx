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
      <div className="relative mb-8 h-62.5 overflow-y-auto rounded-lg border-2 p-6 px-7.5">
        <div>
          <div className="mb-4 flex items-center gap-12.5">
            <h3 className="text-center text-xl whitespace-nowrap underline underline-offset-8">
              {date.getDate()}{' '}
              {numbersToMonths[date.getMonth().toString() as keyof typeof numbersToMonths]}
            </h3>
            <AddEventButton />
            <ShowEventsListButton />
          </div>
          <div className="relative top-0 flex gap-15">
            {hours.map(hour => (
              <div key={hour} className="flex w-2.25 flex-col items-center justify-center gap-1.25">
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
