'use client';
import { Button } from '@/ui/button';
import { fromNumberToInputTime } from '@/utils/funcs/fromNumberToInputTime';
import { useEventsStore } from '@/utils/providers/events-store-provider';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
import { OptionsEventButton } from './options-event-button';

export const ShowEventsListButton = ({}: {}) => {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const { events } = useEventsStore(state => state);

  return (
    <>
      <Button
        className="p-2"
        onClick={() => {
          setIsOpenForm(true);
        }}>
        Показать список событий
      </Button>
      <Dialog open={isOpenForm}>
        <DialogTitle classes={{ root: 'bg-[#25283d]' }}>Список событий</DialogTitle>
        <DialogContent classes={{ root: 'bg-[#25283d] overflow-y-scroll max-h-[400px]' }}>
          <div className="flex flex-col gap-2">
            {events.map(event => (
              <div
                className="flex gap-2 items-center border-2 border-[#7D82B8] p-2 rounded-xl"
                key={event.id}>
                <p>{event.name}</p>
                <div>{fromNumberToInputTime(event.start)}</div>
                <div>{fromNumberToInputTime(event.end)}</div>
                <OptionsEventButton event={event} />
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions classes={{ root: 'bg-[#25283d]' }}>
          <Button className="p-2" onClick={() => setIsOpenForm(false)}>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
