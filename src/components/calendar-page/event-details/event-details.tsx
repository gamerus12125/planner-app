import { DayEventType } from "@/types/types";
import { Button } from "@/ui/button";
import { CloseIcon } from "@/ui/close-icon";
import { Input } from "@/ui/input";
import { daysNumbers, numbersToDays } from "@/utils/consts";
import { MenuItem, Select } from "@mui/material";
import Database from "@tauri-apps/plugin-sql";
import { memo, useEffect, useState } from "react";

export const EventDetails = memo(function EventDetails({
  event,
  isOpen,
  setIsOpen,
  x,
  y,
  setIsChanged,
}: {
  event: DayEventType;
  isOpen: boolean;
  setIsOpen: Function;
  x: number;
  y: number;
  setIsChanged: Function;
}) {
  const [windowWidth, setWindowWidth] = useState(0);
  const [isRepeat, setIsRepeat] = useState(
    event?.repeat ||
      [...daysNumbers, "Не повторять"].includes(event?.repeat || "")
  );

  useEffect(() => {
    setWindowWidth(document.documentElement.clientWidth);
  }, [event]);

  const raw_start = event ? event.start.toString().split(".") : "";
  const raw_end = event ? event.end.toString().split(".") : "";

  const handleClose = (formData: FormData) => {
    const name = formData.get("name");
    const description = formData.get("description");
    const color = formData.get("color");
    const raw_start = formData.get("start")?.toString().split(":");
    const raw_end = formData.get("end")?.toString().split(":");
    const raw_date = formData.get("date")?.toString();
    const repeat = formData.getAll("repeat").join("");

    if (!name || !raw_start || !raw_end || (!isRepeat && !raw_date)) return;

    const start = (Number(raw_start[0]) + Number(raw_start[1]) / 60).toFixed(2);
    const end = (Number(raw_end[0]) + Number(raw_end[1]) / 60).toFixed(2);
    const date = new Date(raw_date || "").toLocaleDateString();

    Database.load("sqlite:test.db")
      .then((db) => {
        db.execute(
          `UPDATE events SET name = $1, start = $2, end = $3, color = $4, description = $5, repeat = $6, date = $7 WHERE id = $8`,
          [
            name,
            start,
            end,
            color,
            description,
            isRepeat ? repeat : null,
            isRepeat ? null : date,
            event?.id,
          ]
        );
      })
      .then(() => {
        setIsChanged((prev: boolean) => !prev);
      })
      .catch((err) => console.log(err));
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

  return (
    isOpen && (
      <div
        className={`rounded-lg w-[350px] z-10 border-2 border-[#7D82B8] bg-[#484a59] p-2 absolute`}
        style={{
          top: `${y}px`,
          left: `${x > windowWidth - 350 ? x - 350 : x}px`,
        }}
      >
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault(), handleClose(new FormData(e.currentTarget));
          }}
        >
          <div className="flex justify-end mb-5">
            <Button type="submit" className="p-2">
              <CloseIcon />
            </Button>
          </div>
          <Input
            name="name"
            type="text"
            id="name"
            required={true}
            defaultValue={event.name}
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]"
          >
            Название
          </Input>
          <Input
            name="description"
            type="text"
            id="description"
            defaultValue={event.description}
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]"
          >
            Описание
          </Input>
          <div className="flex gap-2 items-center relative">
            <label htmlFor="repeat">Повторять каждый</label>
            <Select
              id="repeat"
              name="repeat"
              className="bg-[#25283d] overflow-hidden w-[250px]"
              required={true}
              multiple={true}
              defaultValue={
                Array.isArray(event?.repeat?.split(",")) &&
                !event.repeat
                  .split(",")
                  .map((day) => [...daysNumbers, "Не повторять"].includes(day))
                  .includes(false)
                  ? event.repeat?.split(",")
                  : [
                      Array.isArray(event?.repeat?.split(","))
                        ? "Не повторять"
                        : event.repeat &&
                          [...daysNumbers, "Не повторять"].includes(
                            event.repeat
                          )
                        ? event.repeat
                        : "Не повторять",
                    ]
              }
              onChange={(e) => {
                if (
                  e.target.value.includes("Не повторять") ||
                  e.target.value.length === 0
                ) {
                  setIsRepeat(false);
                } else {
                  setIsRepeat(true);
                }
              }}
            >
              <MenuItem value="Не повторять">Не повторять</MenuItem>
              {daysNumbers.map((day) => (
                <MenuItem key={day} value={day}>
                  {numbersToDays[day.toString() as keyof typeof numbersToDays]}
                </MenuItem>
              ))}
            </Select>
          </div>
          {!isRepeat && (
            <Input
              name="date"
              type="date"
              id="date"
              required={true}
              defaultValue={event.date?.split(".").reverse().join("-")}
              className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]"
            >
              Дата
            </Input>
          )}
          <Input
            name="start"
            type="time"
            id="start"
            required={true}
            defaultValue={
              (raw_start[0].length == 1 ? "0" + raw_start[0] : raw_start[0]) +
              ":" +
              (raw_start[1]
                ? Math.round(Number("0." + raw_start[1]) * 60).toString()
                : "00")
            }
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]"
          >
            Время начала
          </Input>
          <Input
            name="end"
            type="time"
            id="end"
            required={true}
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]"
            defaultValue={
              (raw_end[0].length == 1 ? "0" + raw_end[0] : raw_end[0]) +
              ":" +
              (raw_end[1]
                ? Math.round(Number("0." + raw_end[1]) * 60).toString()
                : "00")
            }
          >
            Время окончания
          </Input>
          <Input
            name="color"
            type="color"
            id="color"
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]"
            defaultValue={event.color ?? "#15803d"}
          >
            Цвет
          </Input>

          <Button type="button" onClick={handleDelete} className="p-2">
            Удалить
          </Button>
        </form>
      </div>
    )
  );
});
