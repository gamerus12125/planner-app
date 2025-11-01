'use client';

import { FilterType, TaskType } from '@/types/types';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { filters } from '@/utils/consts';
import { Menu, MenuItem } from '@mui/material';
import Database from '@tauri-apps/plugin-sql';
import { useEffect, useState } from 'react';
import { AddTaskButton } from './add-task-button';
import { TaskItem } from './task-item';

export const TaskList = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [changed, toggleChanged] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filter, setFilter] = useState<undefined | FilterType>(undefined);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Database.load('sqlite:test.db').then(db => {
      db.select('SELECT * FROM tasks').then((res: any) => {
        setTasks(res);
      });
    });
  }, [changed]);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-center text-2xl mt-5">Список задач</h1>

      <div className="flex gap-2 p-2 border-[#7D82B8] border-2 rounded-xl mt-[50px]">
        <AddTaskButton toggleChanged={toggleChanged} />
        <Button
          type="button"
          onClick={e => {
            setAnchorEl(e.currentTarget);
            setIsFilterMenuOpen(true);
          }}>
          Сортировать по {filter && filter.name.toLowerCase()}
        </Button>
        <Input
          onChange={e => setSearch(e.target.value)}
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
              task =>
                task.name.toLowerCase().includes(search.toLowerCase()) ||
                (task?.description || '').toLowerCase().includes(search.toLowerCase()),
            )
            .map(task => (
              <li key={task.id}>
                <TaskItem
                  className="border-2 border-[#7D82B8]"
                  key={task.id}
                  task={task}
                  setIsChanged={toggleChanged}
                />
              </li>
            ))}
        </ul>
      </div>
      <Menu anchorEl={anchorEl} open={isFilterMenuOpen}>
        {filters.map(filter => (
          <MenuItem
            key={filter.key}
            onClick={() => {
              setIsFilterMenuOpen(false);
              setFilter(filter);
            }}>
            {filter.name}
          </MenuItem>
        ))}
        <MenuItem
          onClick={() => {
            setIsFilterMenuOpen(false);
            setFilter(undefined);
          }}>
          Сбросить
        </MenuItem>
      </Menu>
    </div>
  );
};
