import { DayEventType } from '@/types/types';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { daysString, numbersToDays } from '@/utils/consts';
import { formatFormDataEvent } from '@/utils/funcs/formatFormDataEvent';
import { fromNumberToInputTime } from '@/utils/funcs/fromNumberToInputTime';
import { useEventsStore } from '@/utils/providers/events-store-provider';
import { MenuItem, Select } from '@mui/material';
import { useState } from 'react';

export const EventDetails = ({ event, onClose }: { event: DayEventType; onClose: () => void }) => {
  const [isRepeat, setIsRepeat] = useState(event?.repeat || false);
  const { editEvent } = useEventsStore(state => state);

  const handleSubmit = (formData: FormData) => {
    const data = formatFormDataEvent(formData);
    if (!data) return;
    const { name, description, color, start, end, repeat, date } = data;

    if (
      JSON.stringify({ id: event.id, name, date, start, end, color, description, repeat }) !==
      JSON.stringify(event)
    ) {
      editEvent({ ...event, name, description, color, start, end, repeat, date });
    }
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!event) return null;

  return (
    <form
      className="flex flex-col gap-3 border-2 border-[#7D82B8] bg-[#484a59] p-2 rounded-lg"
      onSubmit={e => (e.preventDefault(), handleSubmit(new FormData(e.currentTarget)))}>
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
        defaultValue={event.description || ''}
        className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]">
        Описание
      </Input>
      <div className="flex gap-2 items-center relative">
        <label htmlFor="repeat">Повторять каждый</label>
        <Select
          id="repeat"
          name="repeat"
          className="bg-[#25283d] overflow-hidden w-62.5"
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
      <div className="flex gap-2 items-center">
        <Button type="submit" className="p-2">
          Сохранить
        </Button>
        <Button type="button" onClick={handleClose} className="p-2">
          Отмена
        </Button>
      </div>
    </form>
  );
};
