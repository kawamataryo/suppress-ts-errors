import type { Arguments, Argv } from "yargs";
import { tsHandler } from "../handlers/tsHandler";
import { DEFAULT_OPTIONS } from "../lib/constants";
import { tsconfigExists } from "../lib/validator";

export const command: string[] = ["*", "ts"];
export const desc = "Suppress TS errors in TypeScript files";

export const builder = (yargs: Argv<DefaultOptions>): Argv<DefaultOptions> =>
  yargs.options(DEFAULT_OPTIONS).check(tsconfigExists);

export const handler = (argv: Arguments<DefaultOptions>): void => {
  const { commentType, tsconfigPath, errorCode, glob, message, text } = argv;

  const insertedCommentCount = tsHandler({
    tsconfigPath,
    commentType,
    errorCode,
    glob,
    message,
    text,
  });

  console.log("\nCompleted 🎉");
  console.log(`suppress errors: ${insertedCommentCount}`);
};
