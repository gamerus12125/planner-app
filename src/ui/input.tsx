import { ChangeEvent, useRef, useState } from "react";
import { Checkbox } from "./checkbox";

export const Input = ({
  className,
  type,
  name,
  placeholder,
  id,
  children,
  required,
  defaultValue,
  positioning,
  divClassName,
  onClick,
  onChange,
  value,
  min,
}: {
  className?: string;
  type: string;
  name: string;
  placeholder?: string;
  id?: string;
  children?: React.ReactNode;
  required?: boolean;
  defaultValue?: string | number;
  positioning?: "horizontal" | "vertical";
  divClassName?: string;
  value?: string | number;
  onClick?: (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  min?: number;
}) => {
  return (
    <>
      {children ? (
        <div
          className={`flex ${
            positioning === "vertical" ? "flex-col" : "flex-row"
          } items-center gap-3 justify-between ${divClassName}`}
          onClick={onClick}
        >
          <label className="text-white" htmlFor={id}>
            {children}
          </label>
          {type === "checkbox" && <Checkbox checked={Boolean(value)} />}
          <input
            required={required}
            type={type}
            id={id}
            name={name}
            value={value}
            checked={value ? Boolean(value) : undefined}
            defaultValue={defaultValue}
            placeholder={placeholder}
            min={min}
            className={`p-2 bg-[#25283d] text-white rounded-lg transition-all ${className} ${
              type === "checkbox" && "opacity-0 w-0 h-0"
            }`}
            onChange={onChange}
          />
        </div>
      ) : (
        <input
          required={required}
          type={type}
          name={name}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={`p-2 bg-[#25283d] text-white rounded-lg transition-all ${className}`}
          onClick={onClick}
          onChange={onChange}
          id={id}
        />
      )}
    </>
  );
};
