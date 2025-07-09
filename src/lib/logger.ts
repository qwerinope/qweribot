import kleur from "kleur";

const logger = {
  err: (arg: string) => console.error(kleur.red().bold().italic('[ERROR] ') + kleur.red().bold(arg)),
  warn: (arg: string) => console.warn(kleur.yellow().bold().italic('[WARN] ') + kleur.yellow().bold(arg)),
  info: (arg: string) => console.info(kleur.white().bold().italic('[INFO] ') + kleur.white(arg)),
  ok: (arg: string) => console.info(kleur.green().bold(arg)),
  enverr: (arg: string) => logger.err(`Please provide a ${arg} in the .env`)
};

export default logger
