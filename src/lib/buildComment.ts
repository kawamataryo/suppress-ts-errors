import { SourceFile, ts } from "ts-morph";
import { COMMENT_TYPE } from "./constants";

const getWhiteSpaceCountFromLineNumber = (
  sourceFile: SourceFile,
  lineNumber: number
): number => {
  const targetLineString = sourceFile.getFullText().split("\n")[lineNumber - 1];
  return targetLineString.search(/\S/);
};

function isSomKindOfJsxAtLine(
  sourceFile: SourceFile,
  lineNumber: number
): boolean {
  const targetNode = sourceFile.getDescendants().find((node) => {
    return lineNumber === node.getStartLineNumber();
  });
  if (!targetNode) {
    throw new Error(`targetNode is not found at line ${lineNumber}`);
  }
  return [
    ts.SyntaxKind.JsxText,
    ts.SyntaxKind.JsxTextAllWhiteSpaces,
    ts.SyntaxKind.JsxElement,
    ts.SyntaxKind.JsxSelfClosingElement,
    ts.SyntaxKind.JsxClosingElement,
    ts.SyntaxKind.JsxFragment,
    ts.SyntaxKind.JsxOpeningFragment,
    ts.SyntaxKind.JsxClosingFragment,
    ts.SyntaxKind.JsxAttribute,
    ts.SyntaxKind.JsxExpression,
    // NOTE: Errors in element tags are not jsx comments, so exclude them
    // ts.SyntaxKind.JsxAttributes,
    // ts.SyntaxKind.JsxSpreadAttribute,
    // ts.SyntaxKind.JsxOpeningElement,
  ].includes(targetNode.getKind());
}

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
  sourceFile;
  return isSomKindOfJsxAtLine(sourceFile, lineNumber)
    ? `${" ".repeat(whiteSpaceCount)}{/*\n${" ".repeat(
        whiteSpaceCount + 1
      )}// ${comment}${withErrorCode ? ` TS${errorCode}` : ""} */}`
    : `${" ".repeat(whiteSpaceCount)}// ${comment}${
        withErrorCode ? ` TS${errorCode}` : ""
      }`;
};
