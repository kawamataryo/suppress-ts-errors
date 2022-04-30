import { CompilerOptions, Project, SourceFile } from "ts-morph";

/*
This function is not used.
It was used to check the feature of ts-morph
*/

const getWhiteSpaceCountFromLineNumber = (
  sourceFile: SourceFile,
  lineNumber: number
): number => {
  const targetLineString = sourceFile.getFullText().split("\n")[lineNumber - 1];
  return targetLineString.search(/\S/);
};

export const convertToCommentedCode = ({
  code,
  comment,
  compilerOptions,
  withErrorMessage,
}: {
  code: string;
  comment: string;
  compilerOptions: CompilerOptions;
  withErrorMessage: boolean;
}): string => {
  const project = new Project({ compilerOptions });
  const sourceFile = project.createSourceFile("target.ts", code);

  const newFileTextArray = sourceFile.getFullText().split("\n");
  let insertTextCount = 0;
  const listOfLineNumberWithErrors: number[] = [];

  sourceFile.getPreEmitDiagnostics().map((d) => {
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
    const insertComment = `${" ".repeat(whiteSpaceCount)}// ${comment}${
      withErrorMessage ? ` (${d.getMessageText()})` : ""
    }`;

    // Insert comment
    newFileTextArray.splice(lineNumber - 1 + insertTextCount, 0, insertComment);

    // Increment error counts
    insertTextCount += 1;
    listOfLineNumberWithErrors.push(lineNumber);
  });

  return newFileTextArray.join("\n");
};
