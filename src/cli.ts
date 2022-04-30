#!/usr/bin/env node

import { Project } from "ts-morph";
import { getArgs } from "./lib/args";
import { existsSync } from "fs";
import { getWhiteSpaceCountFromLineNumber } from "./lib/getWhiteSpaceCountFromLineNumber";
import { generateProgressBar } from "./lib/progressbar";

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
    const sourceTextArray = sourceFile.getFullText().split("\n");
    let insertedCommentCountPerFile = 0;
    const listOfLineNumberWithErrors: number[] = [];

    sourceFile.getPreEmitDiagnostics().forEach((d) => {
      const lineNumber = d.getLineNumber();
      if (lineNumber === undefined) {
        return;
      }

      // Skip errors in rows with errors already found
      if (listOfLineNumberWithErrors.includes(lineNumber)) {
        return;
      }

      // Build comments with indentation matching the error location
      const whiteSpaceCount = getWhiteSpaceCountFromLineNumber(
        sourceFile,
        lineNumber
      );
      const insertComment = `${" ".repeat(whiteSpaceCount)}// @ts-expect-error${
        args.withErrorCode ? ` TS${d.getCode()}` : ""
      }`;

      // Insert comment
      sourceTextArray.splice(
        lineNumber + insertedCommentCountPerFile - 1,
        0,
        insertComment
      );

      // Increment comment counts
      insertedCommentCountPerFile += 1;
      insertedCommentCount += 1;
      listOfLineNumberWithErrors.push(lineNumber);
    });

    if (insertedCommentCountPerFile > 0) {
      sourceFile.replaceWithText(sourceTextArray.join("\n"));
      sourceFile.saveSync();
    }
    progressBar.increment();
  });

  progressBar.stop();
  console.log("Done 🎉");
  console.log("suppress errors:", insertedCommentCount);
};

main();
