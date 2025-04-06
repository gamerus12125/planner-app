"use client";
import { CategoryPageItem as Kanban } from "@/components/tasks-page/kanban-category/category-page-item";
import { CategoryPageItem as List } from "@/components/tasks-page/list-category/category-page-item";
import {
  useViewStore,
} from "@/utils/providers/view-store-provider";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Button } from "@/ui/button";
import { Menu, MenuItem } from "@mui/material";
import { viewNames, viewOptions } from "@/utils/consts";
import { ViewType } from "@/types/types";

const Tasks = ({ view }: { view: ViewType }) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <>
      {view === "kanban" ? (
        <Kanban id={Number.parseInt(id as string)} />
      ) : (
        <List id={Number.parseInt(id as string)} />
      )}
    </>
  );
};

const CategoryPage = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { setView, view } = useViewStore((state) => state);

  return (
    <div>
      <div className="h-max mt-[10px]">
        <Button
          type="button"
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
          }}
          className="p-2"
        >
          Вид: {viewNames[view]}
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
          {viewOptions.map((option) => (
            <MenuItem
              key={option}
              value={option}
              onClick={() => {
                setView(option);
                setAnchorEl(null);
              }}
              disabled={option === view}
              selected={option === view}
            >
              {viewNames[option]}
            </MenuItem>
          ))}
        </Menu>
      </div>
      <Suspense fallback={<div>Загрузка...</div>}>
      <Tasks view={view} />
      </Suspense>
    </div>
  );
};
export default CategoryPage;
