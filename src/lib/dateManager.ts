export function buildTimeString(time1: number, time2: number): string {
  const diff = Math.abs(time1 - time2);
  const timeobj = {
    day: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hour: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minute: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    second: Math.floor((diff % (1000 * 60)) / 1000)
  };
  const stringarray: string[] = [];
  for (const [unit, value] of Object.entries(timeobj)) {
    if (value === 0) continue;
    if (unit === 'second' && timeobj.day > 0) continue;
    stringarray.push(`${value} ${unit}${value === 1 ? '' : 's'}`);
  };
  const last = stringarray.pop();
  return stringarray.length === 0 ? last! : stringarray.join(', ') + " and " + last;
};
