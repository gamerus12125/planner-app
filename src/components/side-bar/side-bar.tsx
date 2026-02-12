import Link from 'next/link';

export const SideBar = () => {
  return (
    <div className="h-[calc(100vh-16px)] rounded-lg border-2 border-primary p-2">
      <ul className="flex flex-col items-center justify-center gap-1">
        <li className="w-full rounded-lg hover:bg-accent-background">
          <Link href={'/calendar'} className="block h-full p-2">
            Календарь
          </Link>
        </li>
        <li className="w-full rounded-lg hover:bg-accent-background">
          <Link href="/" className="block h-full p-2">
            Список задач
          </Link>
        </li>
      </ul>
    </div>
  );
};
