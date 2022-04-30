import { SourceFile } from "ts-morph";

export const getWhiteSpaceCountFromLineNumber = (
  sourceFile: SourceFile,
  lineNumber: number
): number => {
  const targetLineString = sourceFile.getFullText().split("\n")[lineNumber - 1];
  return targetLineString.search(/\S/);
};
