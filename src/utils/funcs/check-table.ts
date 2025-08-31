import Database from "@tauri-apps/plugin-sql";

export const checkTable = (
  db: Database,
  table: string,
  createFunc: (db: Database) => void,
  strings: string[],
  ints: string[],
  reals?: string[]
) => {
  db.select(`PRAGMA table_info(${table})`)
    .then((res: any) => {
      if (res && res.length) {
        if (
          res.length !==
          strings.length + ints.length + (reals ? reals.length : 0)
        ) {
          db.execute(`DROP table ${table}`).then(() => createFunc(db));
          return;
        } else {
          res.forEach((element: any) => {
            if (
              !(strings.includes(element.name) && element.type === "TEXT") &&
              !(ints.includes(element.name) && element.type === "INTEGER") &&
              !(reals?.includes(element.name) && element.type === "REAL")
            ) {
              db.execute(`DROP table ${table}`).then(() => createFunc(db));
              return false;
            }
          });
        }
      } else {
        createFunc(db);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
