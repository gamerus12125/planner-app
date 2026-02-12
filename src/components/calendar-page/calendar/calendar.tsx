import { TaskItem } from '@/components/tasks-page/task-item';
import { useYear } from '@/hooks/useYear';
import { ArrowLeftIcon } from '@/ui/arrow-left-icon';
import { ArrowRightIcon } from '@/ui/arrow-right-icon';
import { Input } from '@/ui/input';
import { daysToNumbers, numbersToMonths } from '@/utils/consts';
import { useTasksStore } from '@/utils/providers/tasks-store-provider';
import { useState } from 'react';
import { DayEvents } from '../day-events/day-events';
import { CalendarItem } from './calendar-item';

export const Calendar = () => {
  const { tasks } = useTasksStore(state => state);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { month, year, decrementMonth, incrementMonth, setDate } = useYear(
    new Date().getFullYear(),
    new Date().getMonth(),
  );

  const getDates = (year: number, month: number) => {
    const dates = [];

    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const dates = getDates(year, month);

  return (
    <div>
      <DayEvents date={currentDate} />
      <div className={'grid grid-cols-[1fr_max-content]'}>
        <div className="flex h-[calc(100vh-332px)] flex-col">
          <div className="flex h-10 items-center justify-center gap-5">
            <button
              onClick={() => decrementMonth()}
              className="rounded-lg p-2 transition-all hover:bg-primary">
              <ArrowLeftIcon className="h-7.5 w-7.5" />
            </button>
            <div className="flex w-43.75 items-center justify-center gap-2">
              <p>
                {numbersToMonths[month.toString() as keyof typeof numbersToMonths]} {year}
              </p>
              <Input
                className="calendar-input h-7.5 w-7.5 bg-[url('/icons/calendar.png')] bg-contain bg-no-repeat p-0! text-transparent!"
                name="date"
                id="date"
                type="date"
                value={new Date(year, month, currentDate.getDate())
                  .toLocaleDateString()
                  .split('.')
                  .reverse()
                  .join('-')}
                onChange={e => {
                  setDate(
                    new Date(e.target.value).getFullYear(),
                    new Date(e.target.value).getMonth(),
                  );
                  setCurrentDate(new Date(e.target.value));
                }}
              />
            </div>
            <button
              onClick={() => incrementMonth()}
              className="rounded-lg p-2 transition-all hover:bg-primary">
              <ArrowRightIcon className="h-7.5 w-7.5" />
            </button>
          </div>
          <div className="h-[calc(100vh-368px)]">
            <div className="grid h-7.5 grid-cols-7">
              {Object.keys(daysToNumbers).map(day => (
                <div key={day} className="overflow-hidden text-center">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid min-h-[calc(100vh-398px)] grid-cols-7">
              {dates.map((date, index) => (
                <CalendarItem
                  key={index}
                  date={date}
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  hasDeadlineTask={tasks.some(
                    task =>
                      task.deadlineDate &&
                      new Date(task.deadlineDate).toLocaleDateString() ===
                        date.toLocaleDateString(),
                  )}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex w-[21vw] flex-col gap-2 rounded-xl border-2 p-2">
          <p className="text-center">Задачи на этот день:</p>
          <ul className="flex flex-col gap-2 overflow-y-auto">
            {tasks
              .filter(
                task =>
                  task.deadlineDate &&
                  new Date(task.deadlineDate).toLocaleDateString() ===
                    currentDate.toLocaleDateString(),
              )
              .map(task => (
                <TaskItem task={task} key={task.id} />
              ))}
          </ul>
          <p className="text-center">Задачи без срока:</p>
          <ul className="flex flex-col gap-2 overflow-y-auto">
            {tasks
              .filter(task => !task.deadlineDate)
              .map(task => (
                <TaskItem task={task} key={task.id} />
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
