import { DayEventType } from '@/types/types';
import { Button } from '@/ui/button';
import { CrossIcon } from '@/ui/cross-icon';
import { EditIcon } from '@/ui/edit-icon';
import { Input } from '@/ui/input';
import { MoreIcon } from '@/ui/more-icon';
import { daysString, numbersToDays } from '@/utils/consts';
import { fromInputToNumberTime } from '@/utils/funcs/fromInputToNumberTime';
import { fromNumberToInputTime } from '@/utils/funcs/fromNumberToInputTime';
import { useEventsStore } from '@/utils/providers/events-store-provider';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  Select,
} from '@mui/material';
import { FormEvent, useState } from 'react';

export const OptionsEventButton = ({ event }: { event: DayEventType }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [isRepeat, setIsRepeat] = useState(event?.repeat || false);
  const { editEvent, removeEvent } = useEventsStore(state => state);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSubmit = (formData: FormData) => {
    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString();
    const color = formData.get('color')?.toString();
    const start = fromInputToNumberTime(formData.get('start') as string);
    const end = fromInputToNumberTime(formData.get('end') as string);
    const raw_date = formData.get('date')?.toString();
    const repeat = formData.getAll('repeat').join('');

    if (!name || !start || !end || (!isRepeat && !raw_date)) return;
    const date = new Date(raw_date || '').toLocaleDateString();
    editEvent({ ...event, name, description, color, start, end, repeat, date });
    setIsOpenForm(false);
  };

  const handleDelete = () => {
    removeEvent(event.id);
    setAnchorEl(null);
  };

  return (
    <>
      <Button className="p-2" onClick={handleClick}>
        <MoreIcon />
      </Button>
      <Menu open={open} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
        <MenuItem className="flex gap-1" onClick={handleDelete}>
          <CrossIcon className="w-6 h-6" /> Удалить
        </MenuItem>
        <MenuItem
          className="flex gap-1"
          onClick={() => {
            setAnchorEl(null);
            setIsOpenForm(true);
          }}>
          <EditIcon /> Редактировать
        </MenuItem>
      </Menu>
      <Dialog
        open={isOpenForm}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (e: FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSubmit(formData);
            },
          },
        }}>
        <DialogTitle className="bg-[#25283d]">Редактировать событие</DialogTitle>
        <DialogContent classes={{ root: 'flex flex-col gap-3 bg-[#25283d]' }}>
          <Input
            name="name"
            type="text"
            id="name"
            required={true}
            defaultValue={event.name}
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]">
            Название
          </Input>
          <Input
            name="description"
            type="text"
            id="description"
            defaultValue={event.description}
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]">
            Описание
          </Input>
          <div className="flex gap-2 items-center relative">
            <label htmlFor="repeat">Повторять каждый</label>
            <Select
              id="repeat"
              name="repeat"
              className="bg-[#25283d] overflow-hidden w-[250px]"
              multiple={true}
              defaultValue={event.repeat?.split(',') || []}
              onChange={e => setIsRepeat(e.target.value.length !== 0)}>
              {daysString.map(day => (
                <MenuItem key={day} value={day}>
                  {numbersToDays[day.toString() as keyof typeof numbersToDays]}
                </MenuItem>
              ))}
            </Select>
          </div>
          {!isRepeat && (
            <Input
              name="date"
              type="date"
              id="date"
              required={true}
              defaultValue={event.date?.split('.').reverse().join('-')}
              className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]">
              Дата
            </Input>
          )}
          <Input
            name="start"
            type="time"
            id="start"
            required={true}
            defaultValue={fromNumberToInputTime(event.start)}
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]">
            Время начала
          </Input>
          <Input
            name="end"
            type="time"
            id="end"
            required={true}
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]"
            defaultValue={fromNumberToInputTime(event.end)}>
            Время окончания
          </Input>
          <Input
            name="color"
            type="color"
            id="color"
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]"
            defaultValue={event.color ?? '#15803d'}>
            Цвет
          </Input>
        </DialogContent>
        <DialogActions classes={{ root: 'bg-[#25283d]' }}>
          <Button className="p-2" type="submit">
            Сохранить
          </Button>
          <Button className="p-2" onClick={() => setIsOpenForm(false)}>
            Отменить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
