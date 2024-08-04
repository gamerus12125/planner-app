import { DayEvent } from "@/types/types";
import { daysName, daysNumber } from "@/utils/consts";
import Database from "@tauri-apps/plugin-sql";
import { useState } from "react";

export const CreateEventForm = ({
  open,
  setIsChanged,
  type,
  rootEventId,
  position,
}: {
  open: {
    isOpen: boolean;
    setIsOpen: Function;
  };
  setIsChanged: Function;
  type: "standard" | "connected";
  rootEventId?: number;
  position?: "left" | "right";
}) => {
  const [isRepeat, setIsRepeat] = useState(false);

  const days = Object.keys(daysName);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (type === "connected") {
      if (!rootEventId) return;
      const duration = Number(formData.get("duration")?.toString());

      Database.load("sqlite:test.db").then((db) => {
        db.select("SELECT * FROM events WHERE id = $1", [rootEventId]).then(
          (res: any) => {
            const rootEvent: DayEvent = res[0];
            db.execute(
              `
              INSERT INTO events (name, ${
                rootEvent.date ? "date" : "repeat"
              }, start, end, color, description, type, rootEventId)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `,
              [
                formData.get("name"),
                rootEvent.date || rootEvent.repeat,
                position === "left"
                  ? rootEvent.start * 60 - duration < 0
                    ? 0
                    : Number(
                        ((rootEvent.start * 60 - duration) / 60).toFixed(2)
                      )
                  : rootEvent.end,
                position === "left"
                  ? rootEvent.start
                  : Number(((rootEvent.end * 60 + duration) / 60).toFixed(2)),
                formData.get("color"),
                formData.get("description"),
                type,
                rootEventId,
              ]
            )
              .then(() => setIsChanged((prev: boolean) => !prev))
              .catch((error) => {
                console.log(error);
              });
          }
        );
      });
    } else {
      const raw_start = formData.get("start")?.toString().split(":");
      const raw_end = formData.get("end")?.toString().split(":");
      const raw_date = formData.get("date")?.toString();
      const repeat = formData.getAll("repeat").map((day) => day.toString());

      if (!raw_start || !raw_end || (!isRepeat && !raw_date)) return;

      const start = (Number(raw_start[0]) + Number(raw_start[1]) / 60).toFixed(
        2
      );
      const end = (Number(raw_end[0]) + Number(raw_end[1]) / 60).toFixed(2);
      const date = new Date(raw_date || "").toLocaleDateString();

      Database.load("sqlite:test.db")
        .then((db) => {
          db.execute(
            `
          INSERT INTO events (name, ${
            isRepeat ? "repeat" : "date"
          }, start, end, color, description, type)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
            [
              formData.get("name"),
              isRepeat
                ? repeat
                    .map((day) =>
                      daysNumber[day as keyof typeof daysNumber].toString()
                    )
                    .join("")
                : date,
              start,
              end,
              formData.get("color"),
              formData.get("description"),
              type,
            ]
          );
        })
        .then(() => setIsChanged((prev: boolean) => !prev))
        .catch((error) => {
          console.log(error);
        });
    }
    open.setIsOpen(false);
  };

  return (
    <div
      className={`h-screen w-full flex justify-center top-0 left-0 backdrop-blur-md z-10 ${
        open.isOpen ? "absolute" : "hidden"
      }`}
    >
      <form
        className={"p-5 bg-[#5E8C61] rounded-xl self-center min-w-[400px]"}
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          className="p-2 bg-[#25283d] hover:bg-[#7D82B8] rounded-lg transition-all"
          onClick={() => open.setIsOpen(false)}
        >
          Закрыть
        </button>
        <h3 className="text-center mb-3">
          Создание {type === "standard" ? "" : "связанного"} события
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label htmlFor="name">Название</label>
            <input
              id="name"
              name="name"
              type="text"
              className="bg-[#25283d] rounded-lg p-1"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <label htmlFor="description">Описание</label>
            <input
              id="description"
              name="description"
              type="text"
              className="bg-[#25283d] rounded-lg p-1"
            />
          </div>
          {type === "standard" ? (
            <>
              <div className="flex justify-between items-center relative">
                <label htmlFor="repeat">Повторять каждый</label>
                <select
                  id="repeat"
                  name="repeat"
                  className="bg-[#25283d] rounded-lg p-1 w-full"
                  required
                  multiple={true}
                  defaultValue={["Не повторять"]}
                  onChange={(e) =>
                    e.target.value === "Не повторять"
                      ? setIsRepeat(false)
                      : setIsRepeat(true)
                  }
                >
                  <option>Не повторять</option>
                  {days.map((day) => (
                    <option key={day}>
                      {daysName[day as keyof typeof daysName]}
                    </option>
                  ))}
                </select>
              </div>
              {!isRepeat && (
                <div className="flex justify-between items-center">
                  <label htmlFor="date">Дата</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    className="bg-[#25283d] rounded-lg p-1"
                    required
                  />
                </div>
              )}

              <div className="flex justify-between items-center">
                <label htmlFor="start">Время начала</label>
                <input
                  id="start"
                  name="start"
                  type="time"
                  className="bg-[#25283d] rounded-lg p-1"
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <label htmlFor="end">Время конца</label>
                <input
                  id="end"
                  name="end"
                  type="time"
                  className="bg-[#25283d] rounded-lg p-1"
                  required
                />
              </div>
            </>
          ) : (
            <div className="flex justify-between items-center">
              <label htmlFor="end">Продолжительность (в минутах)</label>
              <input
                id="duration"
                name="duration"
                type="number"
                min={0}
                className="bg-[#25283d] rounded-lg p-1"
                required
              />
            </div>
          )}
          <div className="flex justify-between items-center">
            <label htmlFor="end">Цвет</label>
            <input
              id="color"
              name="color"
              type="color"
              className="bg-[#25283d] rounded-lg p-1"
            />
          </div>
          <button
            type="submit"
            className="p-2 bg-[#25283d] hover:bg-[#7D82B8] rounded-lg transition-all"
          >
            Добавить
          </button>
        </div>
      </form>
    </div>
  );
};
