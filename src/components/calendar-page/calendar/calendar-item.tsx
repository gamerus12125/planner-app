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
      className={`flex justify-center items-center min-h-12.5 h-[90%] w-[90%] hover:bg-primary hover:cursor-pointer transition-all rounded-3xl
      ${hasDeadlineTask && ' border-2 border-amber-600 '}
      ${date.toDateString() == currentDate.toDateString() && ' bg-primary '}`}
      style={{
        gridColumn: `${date.getDay() || 7} / span 1`,
      }}
      onClick={() => setCurrentDate(date)}>
      {date.getDate()}
    </div>
  );
};
