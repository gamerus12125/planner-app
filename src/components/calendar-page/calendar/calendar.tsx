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
        <div className="flex flex-col h-[calc(100vh-332px)]">
          <div className="flex gap-5 justify-center items-center h-10">
            <button
              onClick={() => decrementMonth()}
              className="p-2 hover:bg-[#7D82B8] rounded-lg transition-all">
              <ArrowLeftIcon className="w-[30px] h-[30px]" />
            </button>
            <div className="flex gap-2 items-center justify-center w-[175px]">
              <p>
                {numbersToMonths[month.toString() as keyof typeof numbersToMonths]} {year}
              </p>
              <Input
                className="w-[30px] h-[30px] p-0! calendar-input text-transparent! bg-contain bg-no-repeat bg-[url('/icons/calendar.png')]"
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
              className="p-2 hover:bg-[#7D82B8] rounded-lg transition-all">
              <ArrowRightIcon className="w-[30px] h-[30px]" />
            </button>
          </div>
          <div className="h-[calc(100vh-368px)]">
            <div className="grid grid-cols-7 h-[30px]">
              {Object.keys(daysToNumbers).map(day => (
                <div key={day} className="text-center overflow-hidden">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 min-h-[calc(100vh-398px)]">
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
        <div className="border-2 rounded-xl p-2 flex flex-col gap-2 w-[21vw]">
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
