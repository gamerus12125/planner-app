import { useState } from "react";

export const useYear = (initialYear: number, initialMonth: number) => {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);

  const incrementMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  const decrementMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const setDate = (year: number, month: number) => {
    setYear(year);
    setMonth(month);
  }
  return { date: new Date(), year, month, incrementMonth, decrementMonth, setDate };
};
