'use client';

import { TaskType } from '@/types/types';
import { ArrowRightIcon } from '@/ui/arrow-right-icon';
import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import { ClockIcon } from '@/ui/clock-icon';
import { CrossIcon } from '@/ui/cross-icon';
import { EditIcon } from '@/ui/edit-icon';
import { Input } from '@/ui/input';
import { MoreIcon } from '@/ui/more-icon';
import { priorities } from '@/utils/consts';
import { formatDateToLocalString } from '@/utils/funcs/formatDateToLocalString';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  Select,
} from '@mui/material';
import Database from '@tauri-apps/plugin-sql';
import { FormEvent, useState } from 'react';

export const TaskItem = ({
  task,
  setIsChanged,
  className = '',
}: {
  task: TaskType;
  setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [hasDeadline, setHasDeadline] = useState(Boolean(task.hasDeadline));
  const [showTaskDescription, setShowTaskDescription] = useState(false);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const checkTask = (id: number) => {
    Database.load('sqlite:test.db').then(db => {
      db.execute(
        `
        UPDATE tasks
        SET isComplete = $1
        WHERE id = $2
      `,
        [task.isComplete ? 0 : 1, id],
      ).then(res => {
        setIsChanged((prev: boolean) => !prev);
      });
    });
  };

  const deleteTask = (id: number) => {
    Database.load('sqlite:test.db').then(db => {
      db.execute('DELETE FROM tasks WHERE id=$1', [id]).then(res => setIsChanged(prev => !prev));
    });
  };

  const editTask = (id: number, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const date = formData.get('date');
    const description = formData.get('description');
    const color = formData.get('color');
    const hasDeadline = Number.parseInt(formData.get('hasDeadline') as string);
    const priority = formData.get('priority');
    if (!name) return;
    Database.load('sqlite:test.db').then(db => {
      db.execute(
        `
        UPDATE tasks
        SET name = $1, deadlineDate = $2, description = $3, color = $4, hasDeadline = $5, priority = $6
        WHERE id = $7
      `,
        [
          name,
          date ? new Date(date?.toString() || '').toISOString() : null,
          description,
          color === '#000000' ? null : color,
          hasDeadline,
          priority,
          id,
        ],
      ).then(res => {
        setIsChanged((prev: boolean) => !prev);
      });
    });
  };

  return (
    <>
      <div className={`rounded-xl p-2 flex gap-2 items-center border-2 ${className}`}>
        {task.color && (
          <div
            className="w-[15px] rounded-l-[10px]"
            style={{
              backgroundColor: task.color,
              height: showTaskDescription ? '75px' : '50px',
            }}></div>
        )}
        <div>
          <div className="gap-2 flex items-center">
            <p className="">{task.name}</p>
            <div onClick={() => checkTask(task.id)} className="cursor-pointer">
              <span
                className={`flex items-center p-1 rounded-md ${
                  task.isComplete
                    ? ' bg-[#5E8C61] '
                    : task.hasDeadline
                      ? new Date(task.deadlineDate).getTime() >= Date.now()
                        ? new Date(task.deadlineDate).toDateString() === new Date().toDateString()
                          ? 'border-2 border-[#FBB13C]'
                          : 'border-2 border-[#5E8C61]'
                        : 'bg-[#8F2D56]'
                      : ''
                }`}>
                <Checkbox
                  checked={Boolean(task.isComplete)}
                  className={`group-hover:block ${task.hasDeadline && 'hidden'}`}
                />
                {task.hasDeadline && <ClockIcon className="group-hover:hidden" />}
                {task.hasDeadline && new Date(task.deadlineDate).toLocaleString().slice(0, 17)}
              </span>
            </div>
            <Button type="button" onClick={handleClick} className="border-none">
              <MoreIcon className="w-[30px] h-[30px]" />
            </Button>
            <Menu open={open} onClose={handleClose} anchorEl={anchorEl}>
              <MenuItem
                className="flex gap-1"
                onClick={
                  deleteTask
                    ? () => {
                        handleClose();
                        deleteTask(task.id);
                      }
                    : undefined
                }>
                <CrossIcon className="w-[24px] h-[24px]" /> Удалить
              </MenuItem>
              <MenuItem
                className="flex gap-1"
                onClick={() => {
                  handleClose();
                  setIsEditingTask(true);
                }}>
                <EditIcon /> Редактировать
              </MenuItem>
            </Menu>
            <Dialog
              open={isEditingTask}
              onClose={() => setIsEditingTask(false)}
              slotProps={{
                paper: {
                  component: 'form',
                  onSubmit: (e: FormEvent<HTMLFormElement>) => {
                    editTask?.(task.id, e);
                    setIsEditingTask(false);
                  },
                },
              }}>
              <DialogTitle className="bg-[#25283d]">Редактирование задачи</DialogTitle>
              <DialogContent className="flex flex-col gap-3 bg-[#25283d]">
                <Input
                  name="name"
                  id="name"
                  placeholder={task.name}
                  type="text"
                  defaultValue={task.name}
                  className="border-2 border-[#7D82B8] focus:border-[#E0C1B3] focus: outline-none">
                  Название задачи
                </Input>
                <Input
                  name="hasDeadline"
                  id="hasDeadline"
                  type="checkbox"
                  value={Number(hasDeadline)}
                  onClick={() => {
                    setHasDeadline(!hasDeadline);
                  }}
                  className="border-2 border-[#7D82B8] focus:border-[#E0C1B3] focus: outline-none">
                  Есть крайний срок
                </Input>
                {hasDeadline && (
                  <Input
                    name="date"
                    id="date"
                    type="datetime-local"
                    defaultValue={
                      task.hasDeadline
                        ? formatDateToLocalString(new Date(task.deadlineDate) || new Date())
                        : new Date().toISOString().slice(0, 16)
                    }
                    required={true}
                    className="border-2 border-[#7D82B8] focus:border-[#E0C1B3] focus: outline-none">
                    Дата крайнего срока
                  </Input>
                )}

                <Input
                  name="description"
                  id="description"
                  type="text"
                  placeholder={task.description}
                  defaultValue={task.description}
                  className="border-2 border-[#7D82B8] focus:border-[#E0C1B3] focus: outline-none">
                  Описание задачи
                </Input>
                <Input
                  name="color"
                  id="color"
                  type="color"
                  defaultValue={task.color}
                  className="border-2 border-[#7D82B8] focus:border-[#E0C1B3] focus: outline-none">
                  Цвет задачи
                </Input>
                <label htmlFor="priority">Приоритет</label>
                <Select id="priority" name="priority" defaultValue={task.priority}>
                  {priorities.map(priority => (
                    <MenuItem key={priority.key} value={priority.key}>
                      {priority.name}
                    </MenuItem>
                  ))}
                </Select>
              </DialogContent>
              <DialogActions className="bg-[#25283d]">
                <Button className="p-2" type="submit">
                  Сохранить
                </Button>
                <Button className="p-2" onClick={() => setIsEditingTask(false)}>
                  Отмена
                </Button>
              </DialogActions>
            </Dialog>
            {task.description && (
              <div>
                <Button
                  type="button"
                  className={`border-none p-1 focus:outline-none text-center text-[16px] h-[30px] w-[30px] ${
                    showTaskDescription && 'rotate-90'
                  }`}
                  onClick={() => setShowTaskDescription(prev => !prev)}>
                  <ArrowRightIcon className="w-[24px] h-[24px]" />
                </Button>
              </div>
            )}
          </div>
          {showTaskDescription && (
            <div className="bg-[#25283d] overflow-hidden">
              <p>{task.description}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
