export const CalendarItem = ({
  date,
  currentDate,
  hasDeadlineTask,
  setCurrentDate,
}: {
  date: Date;
  currentDate: Date;
  hasDeadlineTask: boolean;
  setCurrentDate: (date: Date) => void;
}) => {
  return (
    <div
      className={`flex h-[90%] min-h-12.5 w-[90%] items-center justify-center rounded-3xl transition-all hover:cursor-pointer hover:bg-primary ${hasDeadlineTask && 'border-2 border-amber-600'} ${date.toDateString() == currentDate.toDateString() && 'bg-primary'}`}
      style={{
        gridColumn: `${date.getDay() || 7} / span 1`,
      }}
      onClick={() => setCurrentDate(date)}>
      {date.getDate()}
    </div>
  );
};
