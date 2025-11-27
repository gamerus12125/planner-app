'use client';
import { DayEventType } from '@/types/types';
import { Popover } from '@mui/material';
import { useState } from 'react';
import { EventDetails } from '../event-details/event-details';

export const DayEvent = ({ event, row }: { event: DayEventType; row: number }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const width = 60 + 9;
  const top = 32 * row + 20 + 44 + 16 + 24 + 5;

  const left = (event.start / 60) * width + 34;
  const eventWidth = (Math.floor(event.end - event.start) / 60) * width;
  return (
    <>
      <div
        key={event.id}
        className={`bg-green-700 absolute hover:scale-110 hover:z-10 hover:cursor-pointer transition-all transition-discrete ${
          eventWidth < event.name.trim().length * 10 ? 'hover:w-max!' : ''
        } `}
        style={{
          left: `${left}px`,
          width: `${eventWidth}px`,
          height: '30px',
          top: `${top}px`,
          backgroundColor: event.color || '#000000',
        }}
        onClick={e => {
          setAnchorEl(e.currentTarget);
        }}>
        <p className="overflow-hidden whitespace-pre">{event.name}</p>
      </div>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        onClose={() => setAnchorEl(null)}>
        <EventDetails event={event} setIsOpen={setAnchorEl} />
      </Popover>
    </>
  );
};
