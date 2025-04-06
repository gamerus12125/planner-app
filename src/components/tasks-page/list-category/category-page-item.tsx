"use client";

import { FilterType, TaskType } from "@/types/types";
import Database from "@tauri-apps/plugin-sql";
import { useEffect, useState } from "react";
import { Button } from "@/ui/button";
import { CategoryTask } from "../categories/category-task";
import { Menu, MenuItem } from "@mui/material";
import { filters } from "@/utils/consts";
import { Input } from "@/ui/input";

export const CategoryPageItem = ({ id }: { id: number }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [changed, toggleChanged] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filter, setFilter] = useState<undefined | FilterType>(undefined);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Database.load("sqlite:test.db").then((db) => {
      db.select("SELECT * FROM tasks WHERE categoryId = $1", [id]).then(
        (res: any) => {
          setTasks(res);
        }
      );
    });
  }, [changed, id]);

  const createTask = () => {
    Database.load("sqlite:test.db").then((db) => {
      db.execute(
        "INSERT INTO tasks (name, categoryId, orderNumber, isComplete, creationDate) SELECT $1, $2, COALESCE(MAX(orderNumber), 0) + 1, $3, $4 FROM tasks",
        ["Новая задача", id, 0, new Date().toISOString()]
      ).then((res) => {
        toggleChanged((prev) => !prev);
      });
    });
  };

  const handleClose = () => {
    setIsFilterMenuOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-center text-2xl mt-[20px]">Список задач</h1>
      <div className="flex gap-2 p-2 border-[#7D82B8] border-2 rounded-xl mt-[50px]">
        <Button className="p-2" onClick={createTask}>
          Добавить задачу
        </Button>
        <Button
          type="button"
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
            setIsFilterMenuOpen(true);
          }}
        >
          Сортировать по {filter && filter.name.toLowerCase()}
        </Button>
        <Input
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск"
          type="text"
          name="search"
          className="border-2 border-[#7D82B8] focus:border-[#E0C1B3] focus:outline-none"
        />
      </div>
      <div>
        <ul className="overflow-auto flex flex-col gap-3">
          {(filter ? filter.sortFunction(tasks) : tasks)
            .filter(
              (task) =>
                task.name.toLowerCase().includes(search.toLowerCase()) ||
                (task?.description || "")
                  .toLowerCase()
                  .includes(search.toLowerCase())
            )
            .map((task) => (
              <li key={task.id}>
                <CategoryTask
                  className="gap-2 p-2 justify-start border-2 border-[#7D82B8] flex-wrap"
                  key={task.id}
                  task={task}
                  setIsChanged={toggleChanged}
                  showColor={false}
                />
              </li>
            ))}
        </ul>
      </div>
      <Menu anchorEl={anchorEl} open={isFilterMenuOpen} onClose={handleClose}>
        {filters.map((filter) => (
          <MenuItem
            key={filter.key}
            onClick={() => {
              handleClose();
              setFilter(filter);
            }}
          >
            {filter.name}
          </MenuItem>
        ))}
        <MenuItem
          onClick={() => {
            handleClose();
            setFilter(undefined);
          }}
        >
          Сбросить
        </MenuItem>
      </Menu>
    </div>
  );
};
