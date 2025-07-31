"use client";
import { CategoryPageItem as List } from "@/components/tasks-page/list-category/category-page-item";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const Tasks = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <List id={Number.parseInt(id as string)} />
  );
};

const CategoryPage = () => {

  return (
    <div>
      <Suspense fallback={<div>Загрузка...</div>}>
        <Tasks/>
      </Suspense>
    </div>
  );
};
export default CategoryPage;
