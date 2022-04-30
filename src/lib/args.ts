import yargs from "yargs";

export const getArgs = () =>
  yargs
    .scriptName("suppress-ts-errors")
    .usage("$0 -p <path to tsconfig.json> -c <comment type>")
    .options({
      tsconfigPath: {
        type: "string",
        default: "./tsconfig.json",
        alias: "p",
        demandOption: true,
      },
      withErrorCode: {
        type: "boolean",
        default: false,
        alias: "e",
        demandOption: true,
      },
    })
    .help()
    .alias({ h: "help", v: "version" })
    .parseSync();
