"use client";
import { useYear } from "@/hooks/useYear";
import { useEffect, useState } from "react";
import { DayEvents } from "../day-events/day-events";
import Database from "@tauri-apps/plugin-sql";
import { TaskType } from "@/types/types";
import { CategoryTask } from "@/components/tasks-page/categories/category-task";
import { ArrowLeftIcon } from "@/ui/arrow-left-icon";
import { ArrowRightIcon } from "@/ui/arrow-right-icon";
import { monthsNamesSingle } from "@/utils/consts";
import { Input } from "@/ui/input";

export const Calendar = () => {
  const [tasks, setTasks] = useState<never[] | TaskType[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const { month, year, decrementMonth, incrementMonth, setDate } = useYear(
    new Date().getFullYear(),
    new Date().getMonth()
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  useEffect(() => {
    Database.load("sqlite:test.db").then((db) => {
      db.select(`SELECT * FROM tasks`)
        .then((res: any) => {
          setTasks(res);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }, [isChanged, currentDate]);

  const getDates = (month: number) => {
    const dates = [];

    const date = new Date(new Date().getFullYear(), month, 1);

    while (date.getMonth() === month) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    let firstDay = dates[0].getDay() - 1;
    if (firstDay === -1) {
      firstDay = 6;
    }
    for (let i = 0; i < firstDay; i++) {
      dates.unshift(null);
    }

    const weeks = Array.from(
      { length: Math.ceil(dates.length / 7) },
      (_, i) => i + 1
    );

    return { dates, weeks };
  };

  const { dates, weeks } = getDates(month);
  const days = [0, 1, 2, 3, 4, 5, 6];

  return (
    <div className="h-screen">
      <DayEvents date={currentDate} />
      <div className={"grid grid-cols-[1fr_max-content]"}>
        <div className="flex flex-col h-[calc(100vh-332px)]">
          <div className="flex gap-5 justify-center items-center h-[40px]">
            <button
              onClick={() => decrementMonth()}
              className="p-2 hover:bg-[#7D82B8] rounded-lg transition-all"
            >
              <ArrowLeftIcon className="w-[30px] h-[30px]" />
            </button>
            <div className="flex gap-2 items-center justify-center w-[175px]">
              <p>
                {
                  monthsNamesSingle[
                    month.toString() as keyof typeof monthsNamesSingle
                  ]
                }{" "}
                {year}
              </p>
              <Input
                className="w-[30px] h-[30px] focus:hidden text-transparent! bg-contain bg-no-repeat bg-[url('/icons/calendar.png')]"
                name="date"
                id="date"
                type="date"
                value={new Date(year, month, currentDate.getDate())
                  .toLocaleDateString()
                  .split(".")
                  .reverse()
                  .join("-")}
                onChange={(e) => {
                  setDate(
                    new Date(e.target.value).getFullYear(),
                    new Date(e.target.value).getMonth()
                  );
                  setCurrentDate(new Date(e.target.value));
                }}
              />
            </div>
            <button
              onClick={() => incrementMonth()}
              className="p-2 hover:bg-[#7D82B8] rounded-lg transition-all"
            >
              <ArrowRightIcon className="w-[30px] h-[30px]" />
            </button>
          </div>
          <div className="h-[calc(100vh-368px)]">
            <div className="grid grid-cols-7 h-[30px]">
              <div className="text-center overflow-hidden">Понедельник</div>
              <div className="text-center overflow-hidden">Вторник</div>
              <div className="text-center overflow-hidden">Среда</div>
              <div className="text-center overflow-hidden">Четверг</div>
              <div className="text-center overflow-hidden">Пятница</div>
              <div className="text-center overflow-hidden">Суббота</div>
              <div className="text-center overflow-hidden">Воскресенье</div>
            </div>
            <div className="flex flex-col min-h-[calc(100vh-398px)]">
              {weeks.map((week) => (
                <div key={week} className="grid grid-cols-7 flex-1">
                  {days.map((day) => (
                    <div
                      key={dates[(week - 1) * 7 + day]?.getTime() ?? day}
                      className="h-full min-w-[70px]"
                    >
                      {dates[(week - 1) * 7 + day] ? (
                        <div
                          onClick={() =>
                            setCurrentDate(
                              dates[(week - 1) * 7 + day] || new Date()
                            )
                          }
                          className={`flex justify-center items-center min-h-[50px] h-[90%] w-[90%]
                            ${
                              tasks.some(
                                (task: TaskType) =>
                                  new Date(
                                    task.deadlineDate
                                  ).toLocaleDateString() ===
                                  dates[
                                    (week - 1) * 7 + day
                                  ]?.toLocaleDateString()
                              )
                                ? "border-2 border-amber-600"
                                : ""
                            }
                            ${
                              dates[(week - 1) * 7 + day]?.toDateString() ==
                              currentDate.toDateString()
                                ? "bg-[#7D82B8]"
                                : ""
                            } hover:bg-[#7D82B8] hover:cursor-pointer transition-all rounded-3xl`}
                        >
                          {dates[(week - 1) * 7 + day]?.getDate()}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-2 rounded-xl p-2 flex flex-col gap-2 w-[21vw]">
          <p className="text-center">Задачи на этот день:</p>
          <ul className="flex flex-col gap-2 overflow-y-auto">
            {tasks.length
              ? tasks
                  .filter(
                    (task: TaskType) =>
                      new Date(task.deadlineDate).toLocaleDateString() ===
                      currentDate.toLocaleDateString()
                  )
                  .map((task) => (
                    <CategoryTask
                      setIsChanged={setIsChanged}
                      task={task}
                      key={task.id}
                      className="border-2 p-2"
                    />
                  ))
              : ""}
          </ul>
          <p className="text-center">Задачи без срока:</p>
          <ul className="flex flex-col gap-2 overflow-y-auto">
            {tasks.length
              ? tasks
                  .filter((task: TaskType) => !task.hasDeadline)
                  .map((task) => (
                    <CategoryTask
                      setIsChanged={setIsChanged}
                      task={task}
                      key={task.id}
                      className="border-2 p-2"
                    />
                  ))
              : ""}
          </ul>
        </div>
      </div>
    </div>
  );
};
