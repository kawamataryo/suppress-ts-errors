import type { Arguments, Argv } from "yargs";
import { vueHandler } from "../handlers/vueHandler";
import { DEFAULT_OPTIONS } from "../lib/constants";
import { tsconfigExists } from "../lib/isExistTsConfig";

type Options = DefaultOptions & {
  targetPathPattern: string;
};

export const command = "vue [targetPathPattern]";
export const desc = "Suppress TS errors in Vue files";

export const builder = (yargs: Argv<Options>): Argv<Options> =>
  yargs
    .options(DEFAULT_OPTIONS)
    .check(tsconfigExists)
    .positional("target-path-pattern", {
      type: "string",
      requiresArg: true,
      description:
        "Path to the target vue file, which can be set with the glob pattern. eg: 'src/**/*.vue'",
      default: "src/**/*.vue",
    });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { targetPathPattern, tsconfigPath, commentType, errorCode } = argv;

  const insertedCommentCount = await vueHandler({
    targetPathPattern,
    tsconfigPath,
    commentType,
    errorCode,
  });

  console.log("\nCompleted 🎉");
  console.log(`suppress errors: ${insertedCommentCount}`);
  process.exit(0);
};
