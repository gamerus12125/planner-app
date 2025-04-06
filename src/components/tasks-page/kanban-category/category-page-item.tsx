"use client";

import { CategoryType, CategoryColumnType, TaskType } from "@/types/types";
import { Button } from "@/ui/button";
import { CrossIcon } from "@/ui/cross-icon";
import { Input } from "@/ui/input";
var _ = require("lodash");
import { useClickOutside } from "@reactuses/core";
import Database from "@tauri-apps/plugin-sql";
import { FormEvent, useEffect, useRef, useState } from "react";
import { CategoryColumn } from "./category-column";

import {
  DragDropContext,
  DragStart,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";

export const CategoryPageItem = ({id}: { id: number }) => {
  const [tasks, setTasks] = useState<TaskType[] | []>([]);
  const [columns, setColumns] = useState<CategoryColumnType[] | []>([]);
  const [category, setCategory] = useState<CategoryType>();
  const [isChanged, setIsChanged] = useState(false);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [isColumnDragged, setIsColumnDragged] = useState(false);

  const addColumnRef = useRef<HTMLLIElement>(null);

  useClickOutside(addColumnRef, () => {
    setIsAddingColumn(false);
  });

  useEffect(() => {
    Database.load("sqlite:test.db").then((db) => {
      db.select("SELECT * FROM categories WHERE id = $1", [id]).then(
        (res: any) => {
          setCategory(res[0]);
        }
      );

      db.select("SELECT * FROM columns WHERE categoryId = $1", [id]).then(
        (res: any) => {
          setColumns(res);
        }
      );

      db.select("SELECT * FROM tasks WHERE categoryId = $1", [id]).then(
        (res: any) => {
          setTasks(res.sort((a: any, b: any) => a.orderNumber - b.orderNumber));
        }
      );
    });
  }, [isChanged, id]);
  const addColumn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    if (!name) return;
    Database.load("sqlite:test.db").then((db) => {
      db.execute(
        `
        INSERT INTO columns (name, categoryId, orderNumber)
        VALUES ($1, $2, $3)
      `,
        [
          name,
          category?.id,
          columns.length
            ? Math.max(...columns.map((col) => col.orderNumber)) + 1
            : 1,
        ]
      ).then(() => {
        setIsChanged(!isChanged);
      });
    });

    setIsAddingColumn(false);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (type === "column") setIsColumnDragged(false);

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    )
      return;

    if (type === "column") {
      const newColumns = Array.from(columns);

      const [removed] = newColumns.splice(source.index - 1, 1);

      newColumns.splice(destination.index - 1, 0, removed);

      for (let i = 0; i < newColumns.length; i++) {
        newColumns[i].orderNumber = i + 1;
      }

      setColumns(newColumns);

      Database.load("sqlite:test.db").then((db) => {
        for (let i = 0; i < newColumns.length; i++) {
          db.execute(
            `
            UPDATE columns
            SET orderNumber = $1
            WHERE id = $2
          `,
            [newColumns[i].orderNumber, newColumns[i].id]
          );
        }
      });
    } else {
      const newTasks = tasks
        .filter((task) => task.columnId === Number(destination.droppableId))
        .sort((a, b) => a.orderNumber - b.orderNumber);

      const sourceTask = tasks.find((task) => task.id === Number(draggableId));
      const destinationTask = newTasks[destination.index]

      if (!sourceTask) return;

      if (destination.droppableId === source.droppableId && destinationTask) {
        const oldTasks = JSON.parse(JSON.stringify(tasks));

        const sourceTasks = tasks.filter(
          (task) => task.columnId === Number(source.droppableId)
        );

        const otherTasks = tasks.filter(
          (task) => task.columnId !== Number(source.droppableId)
        );

        const sourceIndex = sourceTasks.findIndex(
          (task) => task.id === sourceTask.id
        );

        const destinationIndex = newTasks.findIndex(
          (task) => task.id === destinationTask.id
        );

        sourceTasks.splice(sourceIndex, 1);
        sourceTasks.splice(destinationIndex, 0, sourceTask);

        for (let i = 0; i < sourceTasks.length; i++) {
          sourceTasks[i].orderNumber = i + 1;
        }
        const result = [...otherTasks, ...sourceTasks];

        setTasks(result);

        Database.load("sqlite:test.db").then((db) => {
          for (let i = 0; i < result.length; i++) {
            if (
              !oldTasks.some((task: TaskType) => _.isEqual(task, result[i]))
            ) {
              db.execute(
                `
            UPDATE tasks
            SET orderNumber = $1
            WHERE id = $2
          `,
                [result[i].orderNumber, result[i].id]
              ).then((res) => {}).catch((err) => console.log(err));
            }
          }
        });
      } else {
        const sourceTasks = tasks.filter(
          (task) => task.columnId === Number(source.droppableId)
        );
        const destinationTasks = newTasks.filter(
          (task) => task.columnId === Number(destination.droppableId)
        );

        const otherTasks = tasks.filter(
          (task) =>
            task.columnId !== Number(source.droppableId) &&
            task.columnId !== Number(destination.droppableId)
        );

        sourceTasks.splice(source.index, 1);
        destinationTasks.splice(destination.index, 0, {
          ...sourceTask,
          columnId: Number(destination.droppableId),
        });

        for (let i = 0; i < sourceTasks.length; i++) {
          sourceTasks[i].orderNumber = i + 1;
        }
        for (let i = 0; i < destinationTasks.length; i++) {
          destinationTasks[i].orderNumber = i + 1;
        }

        const result = [...sourceTasks, ...destinationTasks, ...otherTasks];

        Database.load("sqlite:test.db").then((db) => {
          result.forEach((task) => {
            db.execute(
              `
          UPDATE tasks
          SET orderNumber = $1, columnId = $3
          WHERE id = $2
        `,
              [task.orderNumber, task.id, task.columnId]
            ).then((res) => {}).catch((err) => console.log(err));
          });
        });

        setTasks(result);
      }
    }
  };
  const handleDragStart = (e: DragStart) => {
    const { type } = e;
    if (type === "column") setIsColumnDragged(true);
  };

  return (
    <div>
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <h1 className="text-center text-2xl font-bold my-5">
          {category?.name}
        </h1>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <ul
              className="flex overflow-auto pb-10"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {columns
                ?.sort((a, b) => a.orderNumber - b.orderNumber)
                .map((column) => (
                  <CategoryColumn
                    setIsChanged={setIsChanged}
                    categoryId={category?.id}
                    column={column}
                    key={column.id}
                    tasks={tasks}
                  />
                ))}
              <li
                ref={addColumnRef}
                className={`w-[300px] min-w-[300px] ${
                  isColumnDragged ? "ml-[308px]" : ""
                }`}
              >
                {isAddingColumn ? (
                  <form
                    onSubmit={addColumn}
                    className="p-3 border-2 border-[#7D82B8] rounded-2xl w-full flex flex-col gap-2"
                  >
                    <Input
                      positioning="vertical"
                      name="name"
                      type="text"
                      className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]"                      placeholder="Название колонки"
                    />

                    <div className="flex items-center justify-start gap-2">
                      <Button type="submit" className="p-2">
                        Добавить
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setIsAddingColumn(false)}
                        className="p-2"
                      >
                        <CrossIcon />
                      </Button>
                    </div>
                  </form>
                ) : (
                  <Button
                    className="w-full p-3"
                    onClick={() => setIsAddingColumn(true)}
                  >
                    Добавить колонку
                  </Button>
                )}
              </li>
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
