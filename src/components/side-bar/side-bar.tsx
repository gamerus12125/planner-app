import Link from 'next/link';

export const SideBar = () => {
  return (
    <div className="rounded-lg border-2 border-[#7D82B8] p-2 h-[calc(100vh-16px)]">
      <ul className="flex flex-col justify-center items-center gap-1">
        <li className="hover:bg-[#484a59] w-full rounded-lg">
          <Link href={'/calendar'} className="h-full block p-2">
            Календарь
          </Link>
        </li>
        <li className="hover:bg-[#484a59] w-full rounded-lg">
          <Link href="/" className="h-full block p-2">
            Список задач
          </Link>
        </li>
      </ul>
    </div>
  );
};
