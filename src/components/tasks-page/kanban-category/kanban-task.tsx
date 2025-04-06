"use client";
import { TaskType } from "@/types/types";
import { Draggable, DraggableProvided } from "@hello-pangea/dnd";
import {CategoryTask as Task} from "../categories/category-task";
import { CSSProperties } from "react";

export const CategoryTask = ({
  task,
  setIsChanged,
  className = "",
  index
}: {
  task?: TaskType;
  setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  index: number;
}) => {
  if (!task) return null;

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
  return (
    <>
      <Draggable draggableId={task.id.toString()} index={index}>
        {(provided) => (
          <li
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={getStyle(provided, {
              transform: provided.draggableProps.style?.transform
                ? `${provided.draggableProps.style.transform} translateY(0px)`
                : undefined,
            })}
            className="bg-[#25283d] mb-2 rounded-[10px] p-2"
          >
            {task.color && <div className="h-[20px] rounded-t-[10px]" style={{ backgroundColor: task.color }} />}
            <Task task={task} setIsChanged={setIsChanged} provided={provided} className={className}/>
          </li>
        )}
      </Draggable>
    </>
  );
};
