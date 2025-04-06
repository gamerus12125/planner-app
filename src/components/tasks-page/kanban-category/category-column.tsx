"use client";
import {
  CategoryColumnType as CategoryColumnType,
  TaskType,
} from "@/types/types";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { CrossIcon } from "@/ui/cross-icon";
import { useClickOutside } from "@siberiacancode/reactuse";
import { CSSProperties, FormEvent, useRef, useState } from "react";
import Database from "@tauri-apps/plugin-sql";
import { Draggable, DraggableProvided, Droppable } from "@hello-pangea/dnd";
import { MoreIcon } from "@/ui/more-icon";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
} from "@mui/material";
import { CategoryTask } from "./kanban-task";

export const CategoryColumn = ({
  column,
  tasks,
  categoryId,
  setIsChanged,
}: {
  column: CategoryColumnType;
  tasks: TaskType[] | [];
  categoryId: number | undefined;
  setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const addTaskRef = useRef<HTMLFormElement>(null);
  const [isAddingTask, setIsAddingTask] = useState<number | undefined>();
  const [isEditingColumn, setIsEditingColumn] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hasDeadline, setHasDeadline] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useClickOutside(addTaskRef, () => {
    setIsAddingTask(undefined);
  });

  const addTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const date = formData.get("date");
    if (!name) return;
    Database.load("sqlite:test.db").then((db) => {
      db.execute(
        `
        INSERT INTO tasks (name, isComplete, deadlineDate, creationDate, categoryId, columnId, orderNumber, hasDeadline)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
        [
          name,
          0,
          hasDeadline ? date : null,
          new Date(),
          categoryId,
          column.id,
          tasks.reduce((acc, cur) => (cur.id > acc.orderNumber ? cur : acc), {
            orderNumber: 0,
          }).orderNumber + 1,
          Number(hasDeadline),
        ]
      )
        .then(() => {
          console.log(date)
          setIsAddingTask(undefined);
          setIsChanged((prev: boolean) => !prev);
        })
        .catch((err) => console.log(err));
    });
  };
  const deleteColumn = () => {
    Database.load("sqlite:test.db").then((db) => {
      db.execute("DELETE FROM columns WHERE id=$1", [column.id]).then((res) =>
        setIsChanged((prev) => !prev)
      );
    });
  };

  const getStyle = (
    provided: DraggableProvided,
    style?: CSSProperties | null
  ) => {
    if (!style) {
      return provided.draggableProps.style;
    } else {
      return {
        ...provided.draggableProps.style,
        ...style,
      };
    }
  };

  const editColumn = (e: FormEvent<HTMLFormElement>) => {
    setIsEditingColumn(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const color = formData.get("color");
    Database.load("sqlite:test.db").then((db) => {
      db.execute(
        `
        UPDATE columns
        SET name = $1, color = $2
        WHERE id = $3
      `,
        [name ? name : column.name, color ? color : column.color, column.id]
      ).then((res) => {
        setIsEditingColumn(false);
        handleClose();
        setIsChanged((prev: boolean) => !prev);
      });
    });
  };

  return (
    <>
      <Draggable
        draggableId={column.id.toString()}
        index={column.orderNumber}
        key={column.id}
      >
        {(provided) => (
          <li
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={getStyle(provided, {
              transform: provided.draggableProps.style?.transform
                ? `${provided.draggableProps.style.transform} translateX(0px)`
                : undefined,
            })}
            className="flex flex-col p-3 bg-black rounded-2xl w-[300px] min-w-[300px] h-max mr-2"
          >
            <div
              className="flex justify-evenly mb-2 border-b-2 border-[#7D82B8] w-full p-1 rounded-xl rounded-b-none"
              style={{ backgroundColor: column.color }}
            >
              <h3
                className="block text-xl p-1 w-[80%]"
                {...provided.dragHandleProps}
              >
                {column.name}
              </h3>
              <Button
                type="button"
                className="border-none bg-transparent"
                onClick={handleClick}
              >
                <MoreIcon className="w-[35px] h-[30px]" />
              </Button>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem
                  onClick={() => {
                    deleteColumn();
                  }}
                >
                  Удалить
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    setIsEditingColumn(true);
                  }}
                >
                  Редактировать
                </MenuItem>
              </Menu>
            </div>
            <Droppable droppableId={column.id.toString()}>
              {(provided) => (
                <ul
                  className="flex flex-col min-h-[48px] h-max"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {tasks
                    .filter((task) => task.columnId === column.id)
                    .sort((a, b) => a.orderNumber - b.orderNumber)
                    .map((task) => (
                      <CategoryTask
                        key={task.id}
                        task={task}
                        setIsChanged={setIsChanged}
                        index={tasks.filter((t) => t.columnId === column.id).indexOf(task)}
                      />
                    ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
            {column.id === isAddingTask ? (
              <form
                onSubmit={addTask}
                ref={addTaskRef}
                className={`p-3 bg-[#25283d] rounded-2xl w-full flex flex-col gap-2 starting:h-0 ${hasDeadline ? "h-[200px]" : "h-[150px]"} transition-[height] duration-150`}
              >
                <Input
                  positioning="vertical"
                  name="name"
                  id="name"
                  type="text"
                  className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]"                  placeholder="Название задачи"
                  required={true}
                />
                <Input
                  name="hasDeadline"
                  id="hasDeadline"
                  type="checkbox"
                  className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]"                  value={Number(hasDeadline)}
                  onClick={() => setHasDeadline(!hasDeadline)}
                >
                  Есть срок окончания?
                </Input>
                {hasDeadline && (
                  <Input
                    required={true}
                    name="date"
                    id="date"
                    type="date"
                    className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]"                  />
                )}

                <div className="flex items-center gap-2">
                  <Button className="p-2" type="submit">
                    Добавить задачу
                  </Button>
                  <Button
                    className="p-2"
                    type="button"
                    onClick={() => setIsAddingTask(undefined)}
                  >
                    <CrossIcon />
                  </Button>
                </div>
              </form>
            ) : (
              <Button
                onClick={() => {
                  setIsAddingTask(column.id);
                }}
                type="button"
                className="w-full p-2"
              >
                Добавить задачу
              </Button>
            )}
          </li>
        )}
      </Draggable>
      <Dialog
        open={isEditingColumn}
        onClose={() => setIsEditingColumn(false)}
        PaperProps={{
          component: "form",
          onSubmit: (e: FormEvent<HTMLFormElement>) => editColumn(e),
        }}
      >
        <DialogTitle className="bg-[#25283d]">
          Редактировать колонку
        </DialogTitle>
        <DialogContent className="flex flex-col gap-3 bg-[#25283d]">
          <Input
            name="name"
            id="name"
            type="text"
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]"            placeholder={column.name}
            required={true}
          >
            Название колонки
          </Input>
          <Input
            required={true}
            name="color"
            id="color"
            type="color"
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]"            placeholder={column.color}
          >
            Цвет колонки
          </Input>
        </DialogContent>
        <DialogActions className="bg-[#25283d]">
          <Button type="submit" className="p-2">
            Сохранить
          </Button>
          <Button
            type="button"
            className="p-2"
            onClick={() => setIsEditingColumn(false)}
          >
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
