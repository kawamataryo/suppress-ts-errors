import { Project } from "ts-morph";
import { generateProgressBar } from "../lib/progressBar";
import { suppressTsErrors } from "../lib/suppressTsErrors";

export const tsHandler = ({
  tsconfigPath,
  commentType,
  errorCode,
  glob,
}: DefaultOptions): number => {
  // Get all project files
  const project = new Project({ tsConfigFilePath: tsconfigPath });
  const sourceFiles =
    glob !== undefined
      ? project.getSourceFiles(glob)
      : project.getSourceFiles();

  // Initialize progress bar
  const progressBar = generateProgressBar();
  progressBar.start(sourceFiles.length, 0);

  // Store files that threw an error
  const failedFileArr = [];

  // Rewrite source in ts/tsx file with source with comment
  let insertedCommentCount = 0;
  for (const sourceFile of sourceFiles) {
    try {
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
    } catch {
      failedFileArr.push(sourceFile.getFilePath());
    }
  }

  progressBar.stop();

  if (failedFileArr.length > 0)
    console.log(
      "There were issues handling the following files:",
      failedFileArr,
      "Please review source files before re-running script",
    );
  return insertedCommentCount;
};
