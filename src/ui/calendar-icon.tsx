import { SVGProps } from "react";

export function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="512"
      height="512"
      viewBox="0 0 512 512"
      style={{color: "#000000"}}
      xmlns="http://www.w3.org/2000/svg"
      className="h-[30px] w-[30px]"
      {...props}
    >
      <rect
        width="512"
        height="512"
        x="0"
        y="0"
        rx="30"
        fill="transparent"
        stroke="transparent"
        strokeWidth="0"
        strokeOpacity="100%"
        paintOrder="stroke"
      ></rect>
      <svg
        width="512px"
        height="512px"
        viewBox="0 0 24 24"
        fill="#000000"
        x="0"
        y="0"
        role="img"
        style={{display: "inline-block", verticalAlign: "middle"}}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="#000000">
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <rect width="20" height="18" x="2" y="4" rx="4" />
            <path d="M8 2v4m8-4v4M2 10h20" />
          </g>
        </g>
      </svg>
    </svg>
  );
}
