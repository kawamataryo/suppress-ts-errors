import { SourceFile } from "ts-morph";
import { COMMENT_TYPE } from "./constants";

const getWhiteSpaceCountFromLineNumber = (
  sourceFile: SourceFile,
  lineNumber: number
): number => {
  const targetLineString = sourceFile.getFullText().split("\n")[lineNumber - 1];
  return targetLineString.search(/\S/);
};

export const buildComment = ({
  sourceFile,
  lineNumber,
  commentType,
  errorCode,
  withErrorCode,
}: {
  sourceFile: SourceFile;
  lineNumber: number;
  commentType: number;
  errorCode: number;
  withErrorCode: boolean;
}): string => {
  const comment =
    commentType === 1 ? COMMENT_TYPE.EXPECT_ERROR : COMMENT_TYPE.IGNORE;
  const whiteSpaceCount = getWhiteSpaceCountFromLineNumber(
    sourceFile,
    lineNumber
  );
  return `${" ".repeat(whiteSpaceCount)}// ${comment}${
    withErrorCode ? ` TS${errorCode}` : ""
  }`;
};
