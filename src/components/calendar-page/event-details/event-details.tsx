import { DayEventType } from '@/types/types';
import { Button } from '@/ui/button';
import { CloseIcon } from '@/ui/close-icon';
import { Input } from '@/ui/input';
import { daysString, numbersToDays } from '@/utils/consts';
import { fromInputToNumberTime } from '@/utils/funcs/fromInputToNumberTime';
import { fromNumberToInputTime } from '@/utils/funcs/fromNumberToInputTime';
import { useEventsStore } from '@/utils/providers/events-store-provider';
import { MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';

export const EventDetails = ({
  event,
  setIsOpen,
  x,
  y,
}: {
  event: DayEventType;
  setIsOpen: Function;
  x: number;
  y: number;
}) => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [isRepeat, setIsRepeat] = useState(event?.repeat || false);
  const { editEvent, removeEvent } = useEventsStore(state => state);

  useEffect(() => {
    setWindowWidth(document.documentElement.clientWidth);
  }, [event]);

  const handleClose = (formData: FormData) => {
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
    setIsOpen(false);
  };

  const handleDelete = () => {
    removeEvent(event.id);
    setIsOpen(false);
  };

  if (!event) return null;

  return (
    <div
      className={`rounded-lg w-[350px] z-10 border-2 border-[#7D82B8] bg-[#484a59] p-2 absolute`}
      style={{
        top: `${y}px`,
        left: `${x > windowWidth - 350 ? x - 350 : x}px`,
      }}>
      <form
        className="flex flex-col gap-3"
        onSubmit={e => {
          (e.preventDefault(), handleClose(new FormData(e.currentTarget)));
        }}>
        <div className="flex justify-end mb-5">
          <Button type="submit" className="p-2">
            <CloseIcon />
          </Button>
        </div>
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

        <Button type="button" onClick={handleDelete} className="p-2">
          Удалить
        </Button>
      </form>
    </div>
  );
};
