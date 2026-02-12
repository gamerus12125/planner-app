export const ClockIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24px"
      height="24px">
      <g id="Outlined">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeMiterlimit={10}
          points="12,6 12,12 16,16 "
        />
        <circle
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeMiterlimit={10}
          cx="12"
          cy="12"
          r="9"
        />
      </g>
    </svg>
  );
};
