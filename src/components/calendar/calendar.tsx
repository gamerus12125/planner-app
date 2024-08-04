"use client";
import { useYear } from "@/hooks/useYear";
import Image from "next/image";
import { useState } from "react";
import { DayEvents } from "../day-events/day-events";

export const Calendar = () => {
  const { month, year, inc, dec } = useYear(
    new Date().getFullYear(),
    new Date().getMonth()
  );
  const [currentDate, setCurrentDate] = useState(new Date());

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
      <div className="flex flex-col h-[calc(100vh-332px)]">
        <div className="flex gap-5 justify-center items-center h-[36px]">
          <button
            onClick={() => dec()}
            className="p-2 hover:bg-[#7D82B8] rounded-lg transition-all"
          >
            <Image
              src={"/previous.svg"}
              alt="Предыдущий месяц"
              width={20}
              height={20}
            />
          </button>
          <p>
            {month + 1}, {year}
          </p>
          <button
            onClick={() => inc()}
            className="p-2 hover:bg-[#7D82B8] rounded-lg transition-all"
          >
            <Image
              src={"/next.svg"}
              alt="Следующий месяц"
              width={20}
              height={20}
            />
          </button>
        </div>
        <div className="h-[calc(100vh-368px)]">
          <div className="grid grid-cols-7 h-[30px]">
            <div className="text-center">Понедельник</div>
            <div className="text-center">Вторник</div>
            <div className="text-center">Среда</div>
            <div className="text-center">Четверг</div>
            <div className="text-center">Пятница</div>
            <div className="text-center">Суббота</div>
            <div className="text-center">Воскресенье</div>
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
                        className={`flex justify-center items-center min-h-[50px] h-[90%] w-[90%] ${
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
    </div>
  );
};
