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
      className={`cursor-pointer rounded-lg border-2 border-secondary bg-background transition-all hover:bg-secondary hover:text-black ${className}`}>
      {children}
    </button>
  );
};
