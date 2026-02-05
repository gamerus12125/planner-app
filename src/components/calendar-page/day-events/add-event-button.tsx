import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { daysNumbers, numbersToDays } from '@/utils/consts';
import { formatFormDataEvent } from '@/utils/funcs/formatFormDataEvent';
import { useEventsStore } from '@/utils/providers/events-store-provider';
import { Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select } from '@mui/material';
import { SubmitEvent, useState } from 'react';

export const AddEventButton = () => {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const { addEvent } = useEventsStore(state => state);

  const createEvent = (formData: FormData) => {
    const data = formatFormDataEvent(formData);
    if (!data) return;
    addEvent(data);
  };

  const handleClose = () => {
    setIsOpenForm(false);
    setIsRepeat(false);
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createEvent(formData);
    handleClose();
  };
  return (
    <>
      <Button className="p-2 whitespace-nowrap" onClick={() => setIsOpenForm(true)}>
        Добавить событие
      </Button>
      <Dialog
        open={isOpenForm}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: handleSubmit,
          },
        }}>
        <DialogTitle className="bg-background">Добавить событие</DialogTitle>
        <DialogContent classes={{ root: 'flex flex-col gap-3 bg-background' }}>
          <Input
            name="name"
            type="text"
            id="name"
            required={true}
            className="border-2 border-primary focus:outline-none focus:border-secondary">
            Название
          </Input>
          <Input
            name="description"
            type="text"
            id="description"
            className="border-2 border-primary focus:outline-none focus:border-secondary">
            Описание
          </Input>
          <div className="flex gap-2 items-center relative">
            <label htmlFor="repeat">Повторять каждый {isRepeat}</label>
            <Select
              id="repeat"
              name="repeat"
              className="bg-background overflow-hidden w-62.5"
              multiple={true}
              defaultValue={[]}
              onChange={e => setIsRepeat(e.target.value.length !== 0)}>
              {daysNumbers.map(day => (
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
              className="border-2 border-primary focus:outline-none focus:border-secondary">
              Дата
            </Input>
          )}
          <Input
            name="start"
            type="time"
            id="start"
            required={true}
            className="border-2 border-primary focus:outline-none focus:border-secondary">
            Время начала
          </Input>
          <Input
            name="end"
            type="time"
            id="end"
            required={true}
            className="border-2 border-primary focus:outline-none focus:border-secondary">
            Время окончания
          </Input>
          <Input
            name="color"
            type="color"
            id="color"
            className="border-2 border-primary focus:outline-none focus:border-secondary">
            Цвет
          </Input>
        </DialogContent>
        <DialogActions classes={{ root: 'bg-background' }}>
          <Button type="submit" className="p-2">
            Добавить
          </Button>
          <Button onClick={handleClose} className="p-2">
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
