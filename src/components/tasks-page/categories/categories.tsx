"use client";
import Database from "@tauri-apps/plugin-sql";
import { useEffect, useState } from "react";
import { AddCategory } from "./add-category";
import { CategoryItem } from "./category-item";
import { CategoryType } from "@/types/types";
import { Input } from "@/ui/input";

export const Categories = () => {
  const [isChanged, setIsChanged] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Database.load("sqlite:test.db").then((db) => {
      db.select("SELECT * FROM categories").then((res: any) => {
        setCategories(res);
      });
    });
  }, [isChanged]);

  return (
    <div className="mr-1">
      <h1 className="text-2xl text-center mt-10">Список категорий</h1>
      <div className="pr-1 flex justify-start items-center gap-[10px] my-5 p-3 border-2 border-[#7D82B8] rounded-2xl">
        <AddCategory setIsChanged={setIsChanged} />
        <Input
          placeholder="Поиск"
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          name="search"
          id="search"
          className="border-2 border-[#7D82B8] focus:outline-none focus:border-[#E0C1B3]"
        />
      </div>
      <ul className="flex flex-col justify-center items-center gap-5 ">
        {categories
          .filter((category) =>
            category.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              setIsChanged={setIsChanged}
            />
          ))}
      </ul>
    </div>
  );
};
