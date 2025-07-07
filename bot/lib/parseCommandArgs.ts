import { commandPrefix } from "..";

/** Helper function to extract arguments from commands */
export default function parseCommandArgs(input: string) {
  const a = input.slice(commandPrefix.length);
  const sliceLength = a.startsWith('use') ? 2 : 1;
  const b = a.trim().split(' ').slice(sliceLength);
  return b;
};

export function parseCheerArgs(input: string) {
  const a = input.slice(commandPrefix.length);
  const sliceLength = a.startsWith('testcheer') ? 2 : 0;
  const b = a.trim().split(' ').slice(sliceLength);
  return b;
};
