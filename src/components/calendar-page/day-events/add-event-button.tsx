'use client';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { daysNumbers, numbersToDays } from '@/utils/consts';
import { fromInputToNumberTime } from '@/utils/funcs/fromInputToNumberTime';
import { Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select } from '@mui/material';
import Database from '@tauri-apps/plugin-sql';
import React, { FormEvent, useState } from 'react';

export const AddEventButton = ({
  setIsChanged,
}: {
  setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const createEvent = (formData: FormData) => {
    const name = formData.get('name');
    const description = formData.get('description');
    const color = formData.get('color');
    const start = fromInputToNumberTime(formData.get('start') as string);
    const end = fromInputToNumberTime(formData.get('end') as string);
    const raw_date = formData.get('date')?.toString();
    const repeat = formData.getAll('repeat').join('');

    if (!name || !start || !end || (!isRepeat && !raw_date)) return;

    const date = new Date(raw_date || '').toLocaleDateString();

    Database.load('sqlite:test.db')
      .then(db => {
        db.execute(
          `
            INSERT INTO events (name, ${isRepeat ? 'repeat' : 'date'}, start, end, color, description)
            VALUES ($1, $2, $3, $4, $5, $6)
          `,
          [name, isRepeat ? repeat : date, start, end, color, description],
        );
      })
      .then(res => {
        closeForm();
        setIsChanged(prev => !prev);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const closeForm = () => {
    setIsOpenForm(false);
    setIsRepeat(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createEvent(formData);
  };
  return (
    <>
      <Button
        className="p-2"
        onClick={() => {
          setIsOpenForm(true);
        }}>
        Добавить событие
      </Button>
      <Dialog
        open={isOpenForm}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (e: FormEvent<HTMLFormElement>) => handleSubmit(e),
          },
        }}>
        <DialogTitle className="bg-[#25283d]">Добавить событие</DialogTitle>
        <DialogContent classes={{ root: 'flex flex-col gap-3 bg-[#25283d]' }}>
          <Input
            name="name"
            type="text"
            id="name"
            required={true}
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]">
            Название
          </Input>
          <Input
            name="description"
            type="text"
            id="description"
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]">
            Описание
          </Input>
          <div className="flex gap-2 items-center relative">
            <label htmlFor="repeat">Повторять каждый {isRepeat}</label>
            <Select
              id="repeat"
              name="repeat"
              className="bg-[#25283d] overflow-hidden w-[250px]"
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
              className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]">
              Дата
            </Input>
          )}
          <Input
            name="start"
            type="time"
            id="start"
            required={true}
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]">
            Время начала
          </Input>
          <Input
            name="end"
            type="time"
            id="end"
            required={true}
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]">
            Время окончания
          </Input>
          <Input
            name="color"
            type="color"
            id="color"
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]">
            Цвет
          </Input>
        </DialogContent>
        <DialogActions classes={{ root: 'bg-[#25283d]' }}>
          <Button type="submit" className="p-2">
            Добавить
          </Button>
          <Button onClick={() => closeForm()} className="p-2">
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
