'use client';

import { CategoryType } from '@/types/types';
import { Button } from '@/ui/button';
import { CrossIcon } from '@/ui/cross-icon';
import { EditIcon } from '@/ui/edit-icon';
import { Input } from '@/ui/input';
import { MoreIcon } from '@/ui/more-icon';
import { Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem } from '@mui/material';
import Database from '@tauri-apps/plugin-sql';
import Link from 'next/link';
import { FormEvent, useState } from 'react';

export const CategoryItem = ({
  category,
  setIsChanged,
}: {
  category: CategoryType;
  setIsChanged: Function;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    Database.load('sqlite:test.db')
      .then(db => {
        db.execute(`DELETE FROM categories WHERE id = $1`, [category.id]);
      })
      .then(() => {
        handleClose();
        setIsChanged((prev: boolean) => !prev);
      });
  };

  const editCategory = (id: number, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const description = formData.get('description');
    const color = formData.get('color');
    Database.load('sqlite:test.db').then(db => {
      db.execute(
        `
        UPDATE categories
        SET name = $1, description = $2, color = $3
        WHERE id = $4
      `,
        [name, description, color, id],
      ).then(res => {
        setIsChanged((prev: boolean) => !prev);
      });
    });
  };
  return (
    <div className="flex justify-evenly items-center border-2 border-[#7D82B8] w-[300px] rounded-lg hover:bg-[#7D82B8] transition-all">
      <Link href={`/category?id=${category.id}`} className="block w-[80%] p-3">
        {category.name}
      </Link>
      <Button type="button" onClick={handleClick}>
        <MoreIcon />
      </Button>
      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleDelete();
          }}>
          <CrossIcon /> Удалить
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            setIsEditingCategory(true);
          }}>
          <EditIcon /> Редактировать
        </MenuItem>
      </Menu>
      <Dialog
        open={isEditingCategory}
        onClose={() => setIsEditingCategory(false)}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (e: FormEvent<HTMLFormElement>) => {
              editCategory(category.id, e);
              setIsEditingCategory(false);
            },
          },
        }}>
        <DialogTitle className="bg-[#25283d]">Редактирование категории</DialogTitle>
        <DialogContent className="flex flex-col gap-3 bg-[#25283d]">
          <Input
            name="name"
            type="text"
            defaultValue={category.name}
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]">
            Название
          </Input>
          <Input
            name="description"
            type="text"
            defaultValue={category?.description}
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]">
            Описание
          </Input>
          <Input
            name="color"
            type="color"
            defaultValue={category.color}
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]">
            Цвет
          </Input>
        </DialogContent>
        <DialogActions className="bg-[#25283d]">
          <Button className="p-2" type="submit">
            Сохранить
          </Button>
          <Button className="p-2" onClick={() => setIsEditingCategory(false)}>
            Отменить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
