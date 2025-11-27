import { fromInputToNumberTime } from './fromInputToNumberTime';

export const formatFormDataEvent = (formData: FormData) => {
  const name = formData.get('name')?.toString();
  const raw_description = formData.get('description')?.toString() || '';
  const raw_color = formData.get('color')?.toString();
  const start = fromInputToNumberTime(formData.get('start') as string);
  const end = fromInputToNumberTime(formData.get('end') as string);
  const raw_date = formData.get('date');
  const raw_repeat = formData.getAll('repeat').join('');
  const isRepeat = raw_repeat !== '';

  if (!name || !start || !end || (!isRepeat && !raw_date)) return;
  const date = raw_date ? new Date(raw_date.toString()).toLocaleDateString() : null;
  const description = raw_description !== '' ? raw_description : null;
  const color = raw_color !== undefined ? raw_color : null;
  const repeat = raw_repeat !== '' ? raw_repeat : null;
  return { name, description, color, start, end, repeat, date };
};
