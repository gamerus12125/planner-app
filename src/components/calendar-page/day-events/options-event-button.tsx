import { DayEventType } from '@/types/types';
import { Button } from '@/ui/button';
import { EditIcon } from '@/ui/edit-icon';
import { Dialog } from '@mui/material';
import { useState } from 'react';
import { EventDetails } from '../event-details/event-details';

export const OptionsEventButton = ({ event }: { event: DayEventType }) => {
  const [isOpenForm, setIsOpenForm] = useState<boolean | undefined>();

  return (
    <>
      <Button className="p-2" onClick={() => setIsOpenForm(true)}>
        <EditIcon />
      </Button>
      <Dialog open={Boolean(isOpenForm)}>
        <EventDetails event={event} setIsOpen={setIsOpenForm} />
      </Dialog>
    </>
  );
};
