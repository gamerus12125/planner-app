export const fromInputToNumberTime = (input: string) => {
  const [hours, minutes] = input.split(':');
  return Number(hours) * 60 + Number(minutes);
};
