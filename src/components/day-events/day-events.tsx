"use client";

import { DayEvent } from "@/types/types";
import Database from "@tauri-apps/plugin-sql";
import { useEffect, useMemo, useRef, useState } from "react";
import { EventDetails } from "../event-details/event-details";
import { CreateEventForm } from "../create-event-form/create-event-form";
import Image from "next/image";

export const DayEvents = ({ date }: { date: Date }) => {
  const [events, setEvents] = useState<never[] | DayEvent[]>([]);
  const [isWidthChanged, setIsWidthChanged] = useState(0);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [formDetails, setFormDetails] = useState<{
    currentEvent: DayEvent | undefined;
    formType: "standard" | "connected";
    position: "left" | "right";
  }>({ currentEvent: events[0], formType: "standard", position: "left" });
  const [isChanged, setIsChanged] = useState(false);

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    addEventListener("resize", () => {
      setIsWidthChanged(isWidthChanged + 1);
    });

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
    removeEventListener("resize", () => {
      setIsWidthChanged(isWidthChanged + 1);
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
      const width = (container.current.clientWidth - 116) / 23;

      const left =
        start * width + 36 + 2 * start + Math.floor(ost_s ? width * ost_s : 0);
      const eventWidth =
        Math.floor(event.end - event.start) * width +
        2 * (end - start - 1) +
        Math.floor(
          event.end - event.start ? width * ((event.end - event.start) % 1) : 0
        );

      res.push(
        <div key={event.id}>
          {event.type === "standard" &&
          !events.filter(
            (e) =>
              e.rootEventId &&
              e.rootEventId === event.id &&
              e.end === event.start
          ).length ? (
            <button
              className="absolute bg-[#E0C1B3] rounded-lg hover:-translate-x-2 transition-all"
              style={{
                left: `${left - 13}px`,
                bottom: `${128 - row * 32}px`,
              }}
              onClick={() => {
                setFormDetails({
                  currentEvent: event,
                  formType: "connected",
                  position: "left",
                });
                setIsOpenForm(true);
              }}
            >
              <Image src="/plus.svg" width={20} height={20} alt="plus" />
            </button>
          ) : null}

          <div
            className="bg-green-700 absolute z-10 overflow-hidden hover:scale-105 transition-all"
            onClick={(e) => {
              setIsOpenDetails(true);
              setCoords({ x: e.clientX, y: e.clientY });
              setFormDetails((prev) => ({
                currentEvent: event,
                formType: prev.formType,
                position: "left",
              }));
            }}
            style={{
              left: `${left}px`,
              width: `${eventWidth}px`,
              height: "30px",
              bottom: `${123 - row * 32}px`,
              backgroundColor: event.color,
            }}
          >
            {event.name}
          </div>
          {event.type === "standard" &&
          !events.filter(
            (e) =>
              e.rootEventId &&
              e.rootEventId === event.id &&
              e.start === event.end
          ).length ? (
            <button
              className="absolute bg-[#E0C1B3] rounded-lg hover:translate-x-2 transition-all"
              onClick={() => {
                setFormDetails({
                  currentEvent: event,
                  formType: "connected",
                  position: "right",
                });
                setIsOpenForm(true);
              }}
              style={{
                left: `${left + eventWidth - 8}px`,
                bottom: `${128 - row * 32}px`,
              }}
            >
              <Image src="/plus.svg" width={20} height={20} alt="plus" />
            </button>
          ) : (
            ""
          )}
        </div>
      );
      for (let i = start; i < end; i++) {
        rows[i] = row + 1;
      }
    });
    return { res, row: Math.max(...rows) };
  };

  const hours = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ];

  const { res, row } = useMemo(() => renderEvents(), [events, isWidthChanged]);

  return (
    <>
      <div
        ref={container}
        className="border-2 px-[30px] pb-[40px] overflow-y-scroll relative h-[250px] min-w-[1000px] w-full"
      >
        <h3 className="text-center my-5">
          {date.toLocaleDateString("ru-RU", { month: "long" })} {date.getDate()}
        </h3>
        <div className="flex justify-between">
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
        {res}
      </div>
      <div className="mt-8 flex gap-20 items-center h-[50px]">
        <button
          className=" p-2 hover:bg-[#7D82B8] rounded-lg transition-all"
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
        </button>
      </div>
      <EventDetails
        event={formDetails.currentEvent}
        isOpen={isOpenDetails}
        setIsOpen={setIsOpenDetails}
        x={coords.x}
        y={coords.y}
        setIsChanged={setIsChanged}
      />
      <CreateEventForm
        open={{ isOpen: isOpenForm, setIsOpen: setIsOpenForm }}
        setIsChanged={setIsChanged}
        type={formDetails.formType}
        rootEventId={formDetails.currentEvent?.id}
        position={formDetails.position}
      />
    </>
  );
};
