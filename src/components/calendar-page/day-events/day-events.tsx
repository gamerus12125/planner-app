"use client";

import { DayEventType } from "@/types/types";
import Database from "@tauri-apps/plugin-sql";
import {
  FormEvent,
  JSX,
  useEffect,
  useRef,
  useState,
} from "react";
import { EventDetails } from "../event-details/event-details";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
} from "@mui/material";
import { Input } from "@/ui/input";
import { days, daysNames, hours, monthsNamesWithDate } from "@/utils/consts";
import { Button } from "@/ui/button";

export const DayEvents = ({ date }: { date: Date }) => {
  const [events, setEvents] = useState<never[] | DayEventType[]>([]);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isRepeat, setIsRepeat] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [formDetails, setFormDetails] = useState<{
    currentEvent: DayEventType | undefined;
    formType: "standard" | "connected";
    position: "left" | "right";
  }>({ currentEvent: events[0], formType: "standard", position: "left" });

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpenDetails(false);

    Database.load("sqlite:test.db").then((db) => {
      db.select(
        `SELECT * FROM events WHERE date = $1 OR repeat LIKE '%${date.getDay()}%'`,
        [date.toLocaleDateString()]
      )
        .then((res: any) => {
          setEvents(res);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }, [date, isChanged]);

  const rows = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];

  const renderEvents = () => {
    const res: JSX.Element[] = [];

    events.forEach((event) => {
      if (!event || !container.current) return;
      const start = Math.floor(event.start);
      const end = Math.ceil(event.end);
      const ost_s = event.start % 1;
      const row = Math.max(...rows.slice(start, end));
      const width = 60 + 9;
      const top = 32 * row + 20 + 44 + 16 + 24 + 5;

      const left = start * width + 36 + Math.floor(width * ost_s);
      const eventWidth =
        Math.floor(event.end - event.start) * width +
        Math.floor(
          event.end - event.start ? width * ((event.end - event.start) % 1) : 0
        );

      res.push(
        <div
          key={event.id}
          className={`bg-green-700 absolute hover:scale-110 hover:z-10 hover:cursor-pointer transition-all transition-discrete ${
            eventWidth < event.name.trim().length * 10
              ? "hover:w-[max-content]!"
              : ""
          } `}
          style={{
            left: `${left}px`,
            width: `${eventWidth}px`,
            height: "30px",
            top: `${top}px`,
            backgroundColor: event.color,
          }}
          onClick={(e) => {
            setIsOpenDetails(true);
            setCoords({ x: e.clientX, y: e.clientY });
            setFormDetails((prev) => ({
              currentEvent: event,
              formType: prev.formType,
              position: "left",
            }));
          }}
        >
          <p className="overflow-hidden whitespace-pre">{event.name}</p>
        </div>
      );
      for (let i = start; i < end; i++) {
        rows[i] = row + 1;
      }
    });
    return { res, row: Math.max(...rows) };
  };

  const createStandardEvent = (formData: FormData) => {
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
          `
        INSERT INTO events (name, ${
          isRepeat ? "repeat" : "date"
        }, start, end, color, description, type)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
          [
            name,
            isRepeat ? repeat : date,
            start,
            end,
            color,
            description,
            formDetails.formType,
          ]
        );
      })
      .then((res) => {
        setIsOpenForm(false);
        setIsChanged((prev: boolean) => !prev);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createStandardEvent(formData);
  };

  const { res, row } = renderEvents();

  return (
    <>
      <div
        ref={container}
        className="border-2 px-[30px] overflow-y-auto relative h-[250px] w-full mb-8 p-6"
      >
        <div>
          <div className="flex gap-[100px] items-center mb-4">
            <Button
              className="p-2"
              onClick={() => {
                setFormDetails((prev) => ({
                  formType: "standard",
                  currentEvent: prev.currentEvent,
                  position: "left",
                }));
                setIsOpenForm(true);
              }}
            >
              Добавить событие
            </Button>
            <h3 className="text-center text-xl underline underline-offset-8">
              {date.getDate()}{" "}
              {
                monthsNamesWithDate[
                  date.getMonth().toString() as keyof typeof monthsNamesWithDate
                ]
              }
            </h3>
          </div>
          <div className="flex gap-[60px] relative top-0">
            {hours.map((hour) => (
              <div
                key={hour}
                className="flex flex-col gap-[5px] justify-center items-center w-[9px]"
              >
                <span>{hour}</span>
                <div
                  className="w-[2px] bg-gray-500"
                  style={{ height: `${row * 50}px` }}
                ></div>
              </div>
            ))}
          </div>
        </div>
        {res}
      </div>
      {isOpenDetails && formDetails.currentEvent ? (
        <EventDetails
          event={formDetails.currentEvent}
          isOpen={isOpenDetails}
          setIsOpen={setIsOpenDetails}
          x={coords.x}
          y={coords.y}
          setIsChanged={setIsChanged}
        />
      ) : (
        ""
      )}
      <Dialog
        open={isOpenForm}
        PaperProps={{
          component: "form",
          onSubmit: (e: FormEvent<HTMLFormElement>) => handleSubmit(e),
        }}
      >
        <DialogTitle className="bg-[#25283d]">
          Добавить
          {formDetails.formType === "standard"
            ? " событие"
            : " связанное событие"}
        </DialogTitle>
        <DialogContent className="flex flex-col gap-3 bg-[#25283d]">
          <Input
            name="name"
            type="text"
            id="name"
            required={true}
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]"
          >
            Название
          </Input>
          <Input
            name="description"
            type="text"
            id="description"
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]"
          >
            Описание
          </Input>
          <div className="flex gap-2 items-center relative">
            <label htmlFor="repeat">Повторять каждый {isRepeat}</label>
            <Select
              id="repeat"
              name="repeat"
              className="bg-[#25283d] overflow-hidden w-[250px]"
              required={true}
              multiple={true}
              defaultValue={["Не повторять"]}
              onChange={(e) => {
                if (
                  e.target.value.length === 0 ||
                  e.target.value.includes("Не повторять")
                ) {
                  setIsRepeat(false);
                } else {
                  setIsRepeat(true);
                }
              }}
            >
              <MenuItem value="Не повторять">Не повторять</MenuItem>
              {days.map((day) => (
                <MenuItem key={day} value={day}>
                  {daysNames[day as keyof typeof daysNames]}
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
          >
            Время окончания
          </Input>
          <Input
            name="color"
            type="color"
            id="color"
            className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]"
          >
            Цвет
          </Input>
        </DialogContent>
        <DialogActions className="bg-[#25283d]">
          <Button type="submit" className="p-2">
            Добавить
          </Button>
          <Button onClick={() => setIsOpenForm(false)} className="p-2">
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
