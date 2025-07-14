import { FilterType, PriorityType, TaskType, ViewType } from "@/types/types";

export const daysNames = {
  "1": "Понедельник",
  "2": "Вторник",
  "3": "Среда",
  "4": "Четверг",
  "5": "Пятница",
  "6": "Суббота",
  "0": "Воскресенье",
};

export const days = Object.keys(daysNames);

export const daysNumber = {
  Понедельник: 1,
  Вторник: 2,
  Среда: 3,
  Четверг: 4,
  Пятница: 5,
  Суббота: 6,
  Воскресенье: 0,
};

export const monthsNamesSingle = {
    "0": "Январь",
    "1": "Февраль",
    "2": "Март",
    "3": "Апрель",
    "4": "Май",
    "5": "Июнь",
    "6": "Июль",
    "7": "Август",
    "8": "Сентябрь",
    "9": "Октябрь",
    "10": "Ноябрь",
    "11": "Декабрь",
}

export const monthsNamesWithDate = {
  "0": "Января",
  "1": "Февраля",
  "2": "Марта",
  "3": "Апреля",
  "4": "Мая",
  "5": "Июня",
  "6": "Июля",
  "7": "Августа",
  "8": "Сентября",
  "9": "Октября",
  "10": "Ноября",
  "11": "Декабря",
};

export const datesNames = {
  1: "первое",
  2: "второе",
  3: "третье",
  4: "четвертое",
  5: "пятое",
  6: "шестое",
};

export const hours = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

export const viewOptions: [ViewType, ViewType] = ["list", "kanban"];

export const viewNames = {
  list: "Список",
  kanban: "Доска",
};

export const filters: FilterType[] = [
  {
    name: "Дате создания ↑",
    key: "createdDateUp",
    sortFunction: (tasks: TaskType[]) => {
      return tasks.sort((a, b) => {
        const dateA = new Date(a.creationDate || "");
        const dateB = new Date(b.creationDate || "");
        return dateA.getTime() - dateB.getTime();
      });
    },
  },
  {
    name: "Дате создания ↓",
    key: "createdDateDown",
    sortFunction: (tasks: TaskType[]) => {
      return tasks.sort((a, b) => {
        const dateA = new Date(a.creationDate || "");
        const dateB = new Date(b.creationDate || "");
        return dateB.getTime() - dateA.getTime();
      });
    },
  },
  {
    name: "Дате крайнего срока ↑",
    key: "deadlineDateUp",
    sortFunction: (tasks: TaskType[]) => {
      return tasks.sort((a, b) => {
        const dateA = new Date(a.deadlineDate);
        const dateB = new Date(b.deadlineDate);
        return dateA.getTime() - dateB.getTime();
      });
    },
  },
  {
    name: "Дате крайнего срока ↓",
    key: "deadlineDateDown",
    sortFunction: (tasks: TaskType[]) => {
      return tasks.sort((a, b) => {
        const dateA = new Date(a.deadlineDate);
        const dateB = new Date(b.deadlineDate);
        return dateB.getTime() - dateA.getTime();
      });
    },
  },
  {
    name: "Приоритету ↑",
    key: "priorityUp",
    sortFunction: (tasks: TaskType[]) => {
      console.log(tasks)
      return tasks.sort((a, b) => {
        const priorityA = a.priority;
        const priorityB = b.priority;
        return (
          priorityNums[priorityA || "low"] - priorityNums[priorityB || "low"]
        );
      });
    },
  },
  {
    name: "Приоритету ↓",
    key: "priorityDown",
    sortFunction: (tasks: TaskType[]) => {
      console.log(tasks)
      return tasks.sort((a, b) => {
        const priorityA = a.priority;
        const priorityB = b.priority;
        console.log(priorityA, priorityB)
        return (
          priorityNums[priorityB || "low"] - priorityNums[priorityA || "low"]
        );
      });
    },
  },
];

export const priorities: PriorityType[] = [
  {
    name: "Высокий",
    key: "high",
  },
  {
    name: "Средний",
    key: "middle",
  },
  {
    name: "Низкий",
    key: "low",
  },
];

export const priorityNums = {
  high: 2,
  middle: 1,
  low: 0,
};
