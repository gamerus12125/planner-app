export const fromNumberToInputTime = (time: number) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
