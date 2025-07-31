export const CalendarItem = ({
  date,
  index,
  currentDate,
  hasDeadlineTask,
  setCurrentDate,
}: {
  date: Date;
  index: number;
  currentDate: Date;
  hasDeadlineTask: boolean;
  setCurrentDate: (date: Date) => void;
}) => {
  return (
    <div
      className={`flex justify-center items-center min-h-[50px] h-[90%] w-[90%] hover:bg-[#7D82B8] hover:cursor-pointer transition-all rounded-3xl
                                    ${
                                      hasDeadlineTask &&
                                      " border-2 border-amber-600 "
                                    }
                                    ${
                                      date.toDateString() ==
                                        currentDate.toDateString() &&
                                      " bg-[#7D82B8] "
                                    }`}
      style={
        !index
          ? {
              gridColumn: `${date.getDay() || 7} / span 1`,
            }
          : undefined
      }
      onClick={() => setCurrentDate(date)}
    >
      {date.getDate()}
    </div>
  );
};
