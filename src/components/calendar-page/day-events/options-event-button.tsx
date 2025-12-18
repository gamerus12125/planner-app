import { DayEventType } from '@/types/types';
import { Button } from '@/ui/button';
import { CrossIcon } from '@/ui/cross-icon';
import { EditIcon } from '@/ui/edit-icon';
import { MoreIcon } from '@/ui/more-icon';
import { useEventsStore } from '@/utils/providers/events-store-provider';
import { Dialog, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { EventDetails } from '../event-details/event-details';

export const OptionsEventButton = ({ event }: { event: DayEventType }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isOpenEditForm, setIsOpenEditForm] = useState(false);
  const { removeEvent } = useEventsStore(state => state);
  const open = Boolean(anchorEl);

  const handleRemove = () => {
    removeEvent(event.id);
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setIsOpenEditForm(true);
    setAnchorEl(null);
  };

  return (
    <>
      <Button className="p-2" onClick={e => setAnchorEl(e.target as HTMLElement)}>
        <MoreIcon />
      </Button>
      <Menu open={open} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
        <MenuItem className="flex gap-1" onClick={handleRemove}>
          <CrossIcon className="w-6 h-6" /> Удалить
        </MenuItem>
        <MenuItem className="flex gap-1" onClick={handleEdit}>
          <EditIcon /> Редактировать
        </MenuItem>
      </Menu>
      <Dialog open={Boolean(isOpenEditForm)}>
        <EventDetails event={event} onClose={() => setIsOpenEditForm(false)} />
      </Dialog>
    </>
  );
};
