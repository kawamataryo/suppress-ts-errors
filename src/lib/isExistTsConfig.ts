import { existsSync } from "fs";

export const tsconfigExists = (argv: { tsconfigPath: string }): boolean => {
  if (!existsSync(argv.tsconfigPath)) {
    throw new Error(`${argv.tsconfigPath} does not exist`);
  }
  return true;
};
