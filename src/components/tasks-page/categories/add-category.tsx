"use client";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Database from "@tauri-apps/plugin-sql";
import { FormEvent, useState } from "react";

export const AddCategory = ({ setIsChanged }: { setIsChanged: Function }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const description = formData.get("description");
    const color = formData.get("color");
    if (!name && !description && !color) return;
    Database.load("sqlite:test.db")
      .then((db) => {
        db.execute(
          `INSERT INTO categories (name, description, color) VALUES ($1, $2, $3)`,
          [name, description, color]
        );
      })
      .then((res) => {
        setIsOpen(false);
        setIsChanged((prev: boolean) => !prev);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        PaperProps={{
          component: "form",
          onSubmit: (e: FormEvent<HTMLFormElement>) => handleSubmit(e),
        }}
      >
        <DialogTitle className="bg-[#25283d]">Добавить категорию</DialogTitle>
        <DialogContent className="bg-[#25283d] flex flex-col gap-2">
          <Input
            type="text"
            name="name"
            id="name"
            required={true}
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]"
          >
            Название
          </Input>
          <Input
            name="description"
            id="description"
            type="text"
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]"
          >
            Описание
          </Input>
          <Input
            type="color"
            id="color"
            name="color"
            defaultValue="#15803d"
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]"
          >
            Цвет
          </Input>
        </DialogContent>
        <DialogActions className="bg-[#25283d]">
          <Button type="submit" className="p-2">
            Готово
          </Button>
          <Button
            type="button"
            className="p-2"
            onClick={() => setIsOpen(false)}
          >
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
      <Button className="p-2" onClick={(e) => setIsOpen(true)}>
        Добавить категорию
      </Button>
    </>
  );
};
