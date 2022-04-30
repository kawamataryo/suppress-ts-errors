import yargs from "yargs";

export const getArgs = () =>
  yargs
    .scriptName("suppress-ts-errors")
    .usage("$0 -p <path to tsconfig.json> -c <comment type>")
    .options({
      "tsconfig-path": {
        type: "string",
        default: "./tsconfig.json",
        alias: "p",
        describe: "Path to tsconfig.json",
        demandOption: true,
      },
      "comment-type": {
        choices: [1, 2] as const,
        default: 1,
        alias: "t",
        describe:
          "Choice of comment type. 1 is @ts-expected-error, 2 is @ts-ignore. default is 1",
        demandOption: true,
      },
      "with-error-code": {
        type: "boolean",
        default: false,
        alias: "c",
        demandOption: true,
        describe: "Add error code to comment. e.g. TS2345.",
      },
    })
    .help()
    .alias({ h: "help", v: "version" })
    .parseSync();
