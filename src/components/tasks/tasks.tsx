"use client";
import { Task } from "@/types/types";
import Database from "@tauri-apps/plugin-sql";
import { useEffect, useState } from "react";

export const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>();
  const [newTaskName, setNewTaskName] = useState("");
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    Database.load("sqlite:test.db").then((db) => {
      db.select("SELECT * FROM tasks").then((res: any) => {
        setTasks(res);
      });
    });
  }, [isChanged]);

  const handleSubmit = () => {
    if (!newTaskName) return;
    Database.load("sqlite:test.db").then((db) => {
      db.execute(
        `
        INSERT INTO tasks (name, isComplete)
        VALUES ($1, $2)
      `,
        [newTaskName, 0]
      ).then((res) => {
        console.log(res);
        setIsChanged(!isChanged);
      });
    });
  };

  const handleCheck = (id: number) => {
    Database.load("sqlite:test.db").then((db) => {
      db.execute(
        `
        UPDATE tasks
        SET isComplete = $1
        WHERE id = $2
      `,
        [tasks?.find((task) => task.id === id)?.isComplete ? 0 : 1, id]
      ).then((res) => {
        console.log(res);
        setIsChanged(!isChanged);
      });
    });
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl text-center">Список задач</h1>
        <ul className="my-10 flex flex-col gap-5 max-h-70% overflow-y-auto">
          {tasks?.map((task) => (
            <li
              className="flex justify-between items-center p-2 w-[calc(100vw-280px)] bg-[#7D82B8] rounded-lg"
              key={task.id}
            >
              <p>{task.name}</p>
              <input
                className="w-5 h-5"
                type="checkbox"
                defaultChecked={task.isComplete ? true : false}
                onChange={(e) => handleCheck(task.id)}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-5 absolute top-[calc(100vh-80px)] bg-[#7D82B8] px-1 py-2 rounded-lg w-[calc(100vw-280px)]">
        <input
          type="text"
          className="w-[89%] bg-gray-800 rounded-lg text-white px-1"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
        />
        <button
          className="p-2 bg-[#25283d] hover:bg-[#E0C1B3] hover:text-black rounded-lg transition-all"
          onClick={handleSubmit}
        >
          Добавить задачу
        </button>
      </div>
    </div>
  );
};
