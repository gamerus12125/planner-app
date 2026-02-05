export const Button = ({
  children,
  className,
  onClick,
  type,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: 'button' | 'submit' | 'reset';
}) => {
  return (
    <button
      onClick={onClick}
      type={type || 'button'}
      className={`bg-background cursor-pointer hover:bg-secondary border-secondary border-2 hover:text-black rounded-lg transition-all ${className}`}>
      {children}
    </button>
  );
};
