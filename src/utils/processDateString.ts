export default function processDateString(date: string) {
  const year = date.substring(0, 4);
  const month = date.substring(4, 6);
  const day = date.substring(6, 8);

  return new Date(Date.UTC(+year, +month - 1, +day));
}
