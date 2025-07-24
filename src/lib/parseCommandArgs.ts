import { commandPrefix } from "main";

/** Helper function to extract arguments from commands */
export default function parseCommandArgs(input: string) {
  const nice = input.toLowerCase().slice(commandPrefix.length).trim();
  const sliceLength = nice.startsWith('use') ? 2 : 1;
  return nice.split(' ').slice(sliceLength);
};

export function parseCheerArgs(input: string) {
  const nice = input.toLowerCase().trim();

  // This is for the test command. Remove the command prefix, the command, the whitespace after and the amount of fake bits
  if (nice.startsWith(commandPrefix + 'testcheer')) return nice.slice(commandPrefix.length + 'testcheer'.length + 1).split(' ').slice(1);

  // This is for actual cheers. Remove all 'cheerx' parts of the message
  return nice.split(' ').filter(a => !/cheer[0-9]+/i.test(a));
};
