export const Button = ({
  children,
  className,
  onClick,
  type
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: "button" | "submit" | "reset";
}) => {
  return (
    <button
      onClick={onClick}
      type={type || "button"}
      className={`bg-[#25283d] cursor-pointer hover:bg-[#E0C1B3] border-[#E0C1B3] border-[2px] hover:text-black rounded-lg transition-all ${className}`}
    >
      {children}
    </button>
  );
};
