import { Button } from '@/ui/button';
import Database from '@tauri-apps/plugin-sql';
import { Dispatch, SetStateAction } from 'react';

export const AddTaskButton = ({
  toggleChanged,
}: {
  toggleChanged: Dispatch<SetStateAction<boolean>>;
}) => {
  const createTask = () => {
    Database.load('sqlite:test.db').then(db => {
      db.execute('INSERT INTO tasks (name, isComplete, creationDate) VALUES ($1, $2, $3)', [
        'Новая задача',
        0,
        new Date().toISOString(),
      ])
        .then(res => {
          toggleChanged(prev => !prev);
        })
        .catch(err => console.log(err));
    });
  };
  return (
    <Button className="p-2" onClick={createTask}>
      Добавить задачу
    </Button>
  );
};
