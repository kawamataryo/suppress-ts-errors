import colors from "ansi-colors";
import type { Arguments, Argv } from "yargs";
import { vueHandler } from "../handlers/vueHandler";
import { DEFAULT_OPTIONS } from "../lib/constants";
import { isVueFiles, tsconfigExists } from "../lib/validator";

type Options = DefaultOptions & {
  targetFilePaths: string[];
};

export const command = "vue [targetFilePaths...]";
export const desc = "Suppress TS errors in Vue files";

export const builder = (yargs: Argv<Options>): Argv<Options> =>
  yargs
    .options(DEFAULT_OPTIONS)
    .positional("targetFilePaths", {
      array: true,
      type: "string",
      demandOption: true,
      description:
        "Path to the target vue file, which can be set with the glob pattern. eg: 'src/**/*.vue'",
    } as const)
    .check(tsconfigExists)
    .check(isVueFiles);

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const {
    targetFilePaths,
    tsconfigPath,
    commentType,
    errorCode,
    message,
    text,
  } = argv;

  const insertedCommentCount = await vueHandler({
    targetFilePaths,
    tsconfigPath,
    commentType,
    errorCode,
    message,
    text,
  });

  console.log("\nCompleted 🎉");
  console.log(
    `suppress errors: ${colors.green(insertedCommentCount.toString())}`,
  );
  process.exit(0);
};
