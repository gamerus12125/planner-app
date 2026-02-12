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
import { useTasksStore } from '@/utils/providers/tasks-store-provider';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  Select,
} from '@mui/material';
import { SubmitEvent, useState } from 'react';

export const TaskItem = ({ task, className = '' }: { task: TaskType; className?: string }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [hasDeadline, setHasDeadline] = useState(Boolean(task.deadlineDate));
  const [showTaskDescription, setShowTaskDescription] = useState(false);
  const currentDate = new Date();

  const { editTask, removeTask } = useTasksStore(store => store);

  const checkTask = () => {
    editTask({ ...task, isComplete: task.isComplete ? 0 : 1 });
  };

  const handleSubmit = (id: number, e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name')?.toString();
    const date = formData.get('date')?.toString();
    const description = formData.get('description')?.toString();
    let color = formData.get('color')?.toString();

    console.log(date);

    if (!name) return;

    if (color === '#000000') {
      color = undefined;
    }

    const rawPriority = formData.get('priority')?.toString();

    const priority: 'high' | 'middle' | 'low' | undefined =
      rawPriority === 'high' || rawPriority === 'middle' || rawPriority === 'low'
        ? rawPriority
        : undefined;

    editTask({ ...task, id, name, deadlineDate: date, description, color, priority });
  };

  return (
    <>
      <div className={`flex items-center gap-2 rounded-xl border-2 p-2 ${className}`}>
        {task.color && (
          <div
            className="w-3.75 rounded-l-[10px]"
            style={{
              backgroundColor: task.color,
              height: showTaskDescription ? '75px' : '50px',
            }}></div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <p className="">{task.name}</p>
            <div onClick={() => checkTask()} className="cursor-pointer">
              <span
                className={`flex items-center rounded-md p-1 ${
                  task.isComplete
                    ? 'bg-[#5E8C61]'
                    : task.deadlineDate
                      ? new Date(task.deadlineDate).getTime() >= currentDate.getTime()
                        ? new Date(task.deadlineDate).toDateString() === new Date().toDateString()
                          ? 'border-2 border-[#FBB13C]'
                          : 'border-2 border-[#5E8C61]'
                        : 'bg-[#8F2D56]'
                      : ''
                }`}>
                <Checkbox
                  checked={Boolean(task.isComplete)}
                  className={`group-hover:block ${task.deadlineDate && 'hidden'}`}
                />
                {Boolean(task.deadlineDate) && <ClockIcon className="group-hover:hidden" />}
                {Boolean(task.deadlineDate) &&
                  task.deadlineDate &&
                  new Date(task.deadlineDate).toLocaleString().slice(0, 17)}
              </span>
            </div>
            <Button
              type="button"
              onClick={e => setAnchorEl(e.currentTarget)}
              className="border-none">
              <MoreIcon className="h-7.5 w-7.5" />
            </Button>
            <Menu open={open} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
              <MenuItem
                className="flex gap-1"
                onClick={() => {
                  setAnchorEl(null);
                  removeTask(task.id);
                }}>
                <CrossIcon className="h-6 w-6" /> Удалить
              </MenuItem>
              <MenuItem
                className="flex gap-1"
                onClick={() => {
                  setAnchorEl(null);
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
                  onSubmit: (e: SubmitEvent<HTMLFormElement>) => {
                    handleSubmit(task.id, e);
                    setIsEditingTask(false);
                  },
                },
              }}>
              <DialogTitle className="bg-background">Редактирование задачи</DialogTitle>
              <DialogContent className="flex flex-col gap-3 bg-background">
                <Input
                  name="name"
                  id="name"
                  placeholder={task.name}
                  type="text"
                  defaultValue={task.name}
                  className="border-2 border-primary focus:border-secondary focus:outline-none">
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
                  className="border-2 border-primary focus:border-secondary focus:outline-none">
                  Есть крайний срок
                </Input>
                {hasDeadline && (
                  <Input
                    name="date"
                    id="date"
                    type="datetime-local"
                    defaultValue={
                      task.deadlineDate
                        ? formatDateToLocalString(new Date(task.deadlineDate) || new Date())
                        : ''
                    }
                    required={true}
                    className="border-2 border-primary focus:border-secondary focus:outline-none">
                    Дата крайнего срока
                  </Input>
                )}

                <Input
                  name="description"
                  id="description"
                  type="text"
                  placeholder={task.description}
                  defaultValue={task.description}
                  className="border-2 border-primary focus:border-secondary focus:outline-none">
                  Описание задачи
                </Input>
                <Input
                  name="color"
                  id="color"
                  type="color"
                  defaultValue={task.color}
                  className="border-2 border-primary focus:border-secondary focus:outline-none">
                  Цвет задачи
                </Input>
                <label htmlFor="priority">Приоритет</label>
                <Select id="priority" name="priority" defaultValue={task.priority || ''}>
                  {priorities.map(priority => (
                    <MenuItem key={priority.key} value={priority.key}>
                      {priority.name}
                    </MenuItem>
                  ))}
                  <MenuItem value={''}>Без приоритета</MenuItem>
                </Select>
              </DialogContent>
              <DialogActions className="bg-background">
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
                  className={`h-7.5 w-7.5 border-none p-1 text-center text-[16px] focus:outline-none ${
                    showTaskDescription && 'rotate-90'
                  }`}
                  onClick={() => setShowTaskDescription(prev => !prev)}>
                  <ArrowRightIcon className="h-6 w-6" />
                </Button>
              </div>
            )}
          </div>
          {showTaskDescription && (
            <div className="overflow-hidden bg-background">
              <p>{task.description}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
