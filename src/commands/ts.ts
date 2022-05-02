import { existsSync } from "fs";
import type { Arguments, Argv } from "yargs";
import { generateProgressBar } from "../lib/progressBar";
import { Project } from "ts-morph";
import { suppressTsErrors } from "../lib/suppressTsErrors";
import { DEFAULT_OPTIONS } from "../lib/constants";

type Options = {
  tsconfigPath: string;
  commentType: CommentType;
  errorCode: boolean;
};

export const command: string[] = ["*", "ts"];
export const desc = "Suppress TS errors in TypeScript files";

export const builder = (yargs: Argv<Options>): Argv<Options> =>
  yargs.options(DEFAULT_OPTIONS).check((argv) => {
    // Check if tsconfig.json exists
    if (!existsSync(argv.tsconfigPath)) {
      throw new Error(`${argv.tsconfigPath} does not exist`);
    }
    return true;
  });

export const handler = (argv: Arguments<Options>): void => {
  const { commentType, tsconfigPath, errorCode } = argv;

  // Get all project files
  const project = new Project({ tsConfigFilePath: tsconfigPath });
  const sourceFiles = project.getSourceFiles();

  // Initialize progress bar
  const progressBar = generateProgressBar();
  progressBar.start(sourceFiles.length, 0);

  // Rewrite source in ts/tsx file with source with comment
  let insertedCommentCount = 0;
  sourceFiles.forEach((sourceFile) => {
    const { text: textWithComment, count: insertedCommentCountPerFile } =
      suppressTsErrors({
        sourceFile,
        commentType,
        withErrorCode: errorCode,
      });

    if (insertedCommentCountPerFile > 0) {
      sourceFile.replaceWithText(textWithComment);
      sourceFile.saveSync();
      insertedCommentCount += insertedCommentCountPerFile;
    }
    progressBar.increment();
  });

  progressBar.stop();
  console.log("\nCompleted 🎉");
  console.log(`suppress errors: ${insertedCommentCount}`);
};
