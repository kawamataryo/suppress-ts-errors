#!/usr/bin/env node

import { Project } from "ts-morph";
import { getArgs } from "./lib/args";
import { existsSync } from "fs";
import { generateProgressBar } from "./lib/progressbar";
import { suppressTsErrors } from "./lib/suppressTsErrors";

const main = () => {
  const args = getArgs();
  const progressBar = generateProgressBar();

  // Check if tsconfig.json exists
  if (!existsSync(args.tsconfigPath)) {
    console.error(`${args.tsconfigPath} does not exist`);
    process.exit(1);
  }

  const project = new Project({ tsConfigFilePath: args.tsconfigPath });
  const sourceFiles = project.getSourceFiles();

  let insertedCommentCount = 0;

  progressBar.start(sourceFiles.length, 0);

  sourceFiles.forEach((sourceFile) => {
    const { text: textWithComment, count: insertedCommentCountPerFile } =
      suppressTsErrors({
        sourceFile,
        commentType: args.commentType as CommentType,
        withErrorCode: args.withErrorCode,
      });

    if (insertedCommentCountPerFile > 0) {
      sourceFile.replaceWithText(textWithComment);
      sourceFile.saveSync();
      insertedCommentCount += insertedCommentCountPerFile;
    }
    progressBar.increment();
  });

  progressBar.stop();
  console.log("Done 🎉");
  console.log("suppress errors:", insertedCommentCount);
};

main();
