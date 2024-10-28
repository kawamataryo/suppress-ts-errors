import { Project, type SourceFile } from "ts-morph";
import { generateProgressBar } from "../lib/progressBar";
import { suppressTsErrors } from "../lib/suppressTsErrors";

export const tsHandler = ({
  tsconfigPath,
  commentType,
  errorCode,
}: DefaultOptions): number => {
  // Get all project files
  const project = new Project({ tsConfigFilePath: tsconfigPath });
  const sourceFiles = project.getSourceFiles();

  // Initialize progress bar
  const progressBar = generateProgressBar();
  progressBar.start(sourceFiles.length, 0);

  // Rewrite source in ts/tsx file with source with comment
  const targetFiles: {
    sourceFile: SourceFile;
    textWithComment: string;
    insertedCommentCountPerFile: number;
  }[] = [];
  for (const sourceFile of sourceFiles) {
    const { text: textWithComment, count: insertedCommentCountPerFile } =
      suppressTsErrors({
        sourceFile,
        commentType,
        withErrorCode: errorCode,
      });

    if (insertedCommentCountPerFile > 0) {
      targetFiles.push({
        sourceFile,
        textWithComment,
        insertedCommentCountPerFile,
      });
    }
    progressBar.increment();
  }

  for (const targetFile of targetFiles) {
    targetFile.sourceFile.replaceWithText(targetFile.textWithComment);
  }

  project.saveSync();

  progressBar.stop();
  return targetFiles.reduce(
    (acc, targetFile) => acc + targetFile.insertedCommentCountPerFile,
    0,
  );
};
