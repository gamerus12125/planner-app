import { DayEvent } from "@/types/types";
import Database from "@tauri-apps/plugin-sql";
import Image from "next/image";
import { memo, useEffect, useState } from "react";

export const EventDetails = memo(function EventDetails({
  event,
  isOpen,
  setIsOpen,
  x,
  y,
  setIsChanged,
}: {
  event?: DayEvent;
  isOpen: boolean;
  setIsOpen: Function;
  x: number;
  y: number;
  setIsChanged: Function;
}) {
  const [newValues, setNewValues] = useState<DayEvent>(
    event || {
      id: 0,
      name: "",
      date: new Date(),
      start: 0,
      end: 0,
      color: "",
      description: "",
      type: "standard",
      rootEventId: undefined,
    }
  );
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setNewValues(
      event || {
        id: 0,
        name: "",
        date: new Date(),
        start: 0,
        end: 0,
        color: "",
        description: "",
        type: "standard",
        rootEventId: undefined,
      }
    );
    setWindowWidth(document.documentElement.clientWidth);
  }, [event]);

  const raw_start = newValues.start.toString().split(".");
  const raw_end = newValues.end.toString().split(".");

  const handleClose = () => {
    Database.load("sqlite:test.db")
      .then((db) => {
        db.execute(
          `UPDATE events SET name = $1, start = $2, end = $3, color = $4, description = $5 WHERE id = $6`,
          [
            newValues.name,
            newValues.start,
            newValues.end,
            newValues.color,
            newValues.description,
            event?.id,
          ]
        );
        db.execute("DELETE FROM events WHERE rootEventId = $1", [event?.id]);
      })
      .then(() => {
        setIsChanged((prev: boolean) => !prev);
      });
    setIsOpen(false);
  };

  const handleDelete = () => {
    Database.load("sqlite:test.db")
      .then((db) => {
        db.execute(`DELETE FROM events WHERE id = $1`, [event?.id]);
      })
      .then(() => setIsChanged((prev: boolean) => !prev));
    setIsOpen(false);
  };

  if (!event) return null;
  return (
    isOpen && (
      <div
        className={`rounded-lg w-[350px] z-10 border-2 border-[#7D82B8] bg-[#484a59] p-2 absolute`}
        style={{
          top: `${y}px`,
          left: `${x > windowWidth - 350 ? x - 350 : x}px`,
        }}
      >
        <div className="flex justify-end mb-5">
          <button
            className="p-2 hover:bg-[#7D82B8] rounded-lg transition-all"
            onClick={handleClose}
          >
            <Image
              src={"/close.svg"}
              alt="close"
              width={20}
              height={20}
              className="cursor-pointer"
            />
          </button>
        </div>
        <form className="flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <label>Название</label>
            <input
              className="bg-[#25283d] rounded-lg p-1"
              value={newValues.name ?? ""}
              id="name"
              type="text"
              onChange={(e) =>
                setNewValues({ ...newValues, name: e.target.value })
              }
            />
          </div>
          <div className="flex gap-2 items-center">
            <label>Описание</label>
            <input
              className="bg-[#25283d] rounded-lg p-1"
              value={newValues.description ?? ""}
              id="description"
              type="text"
              onChange={(e) =>
                setNewValues({ ...newValues, description: e.target.value })
              }
            />
          </div>
          <div className="flex gap-2 items-center">
            <label>Цвет</label>
            <input
              className="bg-[#25283d] rounded-lg p-1"
              value={newValues.color ?? "#15803d"}
              id="color"
              type="color"
              onChange={(e) =>
                setNewValues({ ...newValues, color: e.target.value })
              }
            />
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="start">Время начала</label>
            <input
              id="start"
              name="start"
              type="time"
              value={
                (raw_start[0].length == 1 ? "0" + raw_start[0] : raw_start[0]) +
                ":" +
                (raw_start[1]
                  ? Math.round(Number("0." + raw_start[1]) * 60).toString()
                  : "00")
              }
              className="bg-[#25283d] gap-2 rounded-lg p-1"
              onChange={(e) => {
                setNewValues({
                  ...newValues,
                  start: Number(
                    (
                      Number(e.target.value.toString().split(":")[0]) +
                      Number(e.target.value.toString().split(":")[1]) / 60
                    ).toFixed(2)
                  ),
                });
              }}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="end">Время конца</label>
            <input
              id="end"
              name="end"
              type="time"
              value={
                (raw_end[0].length == 1 ? "0" + raw_end[0] : raw_end[0]) +
                ":" +
                (raw_end[1]
                  ? Math.round(Number("0." + raw_end[1]) * 60).toString()
                  : "00")
              }
              className="bg-[#25283d] gap-2 rounded-lg p-1"
              onChange={(e) => {
                setNewValues({
                  ...newValues,
                  end: Number(
                    (
                      Number(e.target.value.toString().split(":")[0]) +
                      Number(e.target.value.toString().split(":")[1]) / 60
                    ).toFixed(2)
                  ),
                });
              }}
            />
          </div>
          <button
            className="bg-[#7D82B8] p-2 rounded-lg"
            onClick={handleDelete}
          >
            Удалить
          </button>
        </form>
      </div>
    )
  );
});
