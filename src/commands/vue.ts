import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import glob from "glob";
import type { Arguments, Argv } from "yargs";
import { extractTypeScriptFromVue } from "../lib/extractTypeScriptFromVue";
import { generateProgressBar } from "../lib/progressBar";
import { Project } from "ts-morph";
import { suppressTsErrors } from "../lib/suppressTsErrors";
import { DEFAULT_OPTIONS } from "../lib/constants";
import colors from "ansi-colors";

type Options = {
  tsconfigPath: string;
  commentType: CommentType;
  errorCode: boolean;
  targetPathPattern: string;
};

export const command = "vue [targetPathPattern]";
export const desc = "Suppress TS errors in Vue files";

export const builder = (yargs: Argv<Options>): Argv<Options> =>
  yargs
    .options(DEFAULT_OPTIONS)
    .check((argv) => {
      // Check if tsconfig.json exists
      if (!existsSync(argv.tsconfigPath)) {
        throw new Error(`${argv.tsconfigPath} does not exist`);
      }
      return true;
    })
    .positional("target-path-pattern", {
      type: "string",
      requiresArg: true,
      description:
        "Path to the target vue file, which can be set with the glob pattern. eg: 'src/**/*.vue'",
      default: "src/**/*.vue",
    });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { targetPathPattern, tsconfigPath, commentType, errorCode } = argv;

  // Extract script from vue files
  const filePaths = glob.sync(targetPathPattern);
  const allFiles = await Promise.all(
    filePaths.map(async (path) => {
      const fullText = await readFile(path, "utf8");
      const script = extractTypeScriptFromVue(fullText);
      return {
        path,
        fullText,
        script,
      };
    })
  );

  // Filter only files with script
  const targetFiles = allFiles.filter((file) => file.script !== "");

  // Start progress bar
  const progressBar = generateProgressBar(colors.green);
  progressBar.start(targetFiles.length, 0);

  // Add source to project
  const project = new Project({ tsConfigFilePath: tsconfigPath });
  const targetFilesWithSourceFile = targetFiles.map((file) => {
    const sourceFile = project.createSourceFile(`${file.path}.ts`, file.script);

    return {
      ...file,
      sourceFile,
    };
  });

  // Rewrite script in vue file with script with comment
  // NOTE: Running in series because the progress bar count does not work well in parallel
  let insertedCommentCount = 0;
  for await (const file of targetFilesWithSourceFile) {
    const { text: scriptWithComment, count } = suppressTsErrors({
      sourceFile: file.sourceFile,
      commentType,
      withErrorCode: errorCode,
    });

    const newText = file.fullText.replace(file.script, scriptWithComment);
    await writeFile(file.path, newText);

    insertedCommentCount += count;
    progressBar.increment();
  }

  progressBar.stop();
  console.log("\nCompleted 🎉");
  console.log(`suppress errors: ${insertedCommentCount}`);
  process.exit(0);
};
