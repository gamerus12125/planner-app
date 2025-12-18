import Database from '@tauri-apps/plugin-sql';

export const checkTable = (
  db: Database,
  table: string,
  createFunc: (db: Database) => void,
  strings: string[],
  ints: string[],
  reals?: string[],
) => {
  db.select(`PRAGMA table_info(${table})`)
    .then(res => {
      if (res && typeof res === 'object' && 'length' in res && typeof res.length === 'number') {
        const checkedRes = res as { cid: number; name: string; type: string; notnull: number }[];
        if (res.length !== strings.length + ints.length + (reals ? reals.length : 0)) {
          db.execute(`DROP table ${table}`).then(() => createFunc(db));
          return;
        } else {
          checkedRes.forEach(element => {
            if (
              !(strings.includes(element.name) && element.type === 'TEXT') &&
              !(ints.includes(element.name) && element.type === 'INTEGER') &&
              !(reals?.includes(element.name) && element.type === 'REAL')
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
    .catch(err => {
      console.log(err);
    });
};
