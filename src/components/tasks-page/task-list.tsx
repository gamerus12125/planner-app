import { FilterType } from '@/types/types';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { filters } from '@/utils/consts';
import { useTasksStore } from '@/utils/providers/tasks-store-provider';
import { Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { TaskItem } from './task-item';

export const TaskList = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filter, setFilter] = useState<undefined | FilterType>(undefined);
  const [search, setSearch] = useState('');
  const { tasks, createTask } = useTasksStore(store => store);

  const isFilterMenuOpen = Boolean(anchorEl);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-center text-2xl mt-5">Список задач</h1>

      <div className="flex gap-2 p-2 border-[#7D82B8] border-2 rounded-xl mt-[50px]">
        <Button className="p-2" onClick={() => createTask()}>
          Добавить задачу
        </Button>
        <Button
          type="button"
          onClick={e => {
            setAnchorEl(e.currentTarget);
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
                <TaskItem className="border-2 border-[#7D82B8]" key={task.id} task={task} />
              </li>
            ))}
        </ul>
      </div>
      <Menu anchorEl={anchorEl} open={isFilterMenuOpen}>
        {filters.map(filter => (
          <MenuItem
            key={filter.key}
            onClick={() => {
              setAnchorEl(null);
              setFilter(filter);
            }}>
            {filter.name}
          </MenuItem>
        ))}
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setFilter(undefined);
          }}>
          Сбросить
        </MenuItem>
      </Menu>
    </div>
  );
};
