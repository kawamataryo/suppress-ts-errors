import type { SourceFile } from "ts-morph";
import { buildComment } from "./buildComment";

// Max length for appended error text when using the `--text` option
const MAX_ERROR_TEXT_LENGTH = 100;

export const suppressTsErrors = ({
  sourceFile,
  commentType,
  withErrorCode,
  message,
  withErrorText,
}: {
  sourceFile: SourceFile;
  commentType: CommentType;
  withErrorCode: boolean;
  message?: string;
  withErrorText?: boolean;
}): {
  text: string;
  count: number;
} => {
  const sourceTextArray = sourceFile.getFullText().split("\n");
  let insertedCommentCount = 0;
  const listOfLineNumberWithErrors: number[] = [];

  for (const d of sourceFile.getPreEmitDiagnostics()) {
    const lineNumber = d.getLineNumber();
    const diagnosticCategory = d.getCategory();

    // Skip not error
    if (lineNumber === undefined || diagnosticCategory !== 1) {
      continue;
    }

    // Skip errors in rows with errors already found
    if (listOfLineNumberWithErrors.includes(lineNumber)) {
      continue;
    }

    // Build comments with indentation matching the error location
    // decide message content: explicit message overrides error text
    let messageFromError: string | undefined = undefined;
    let finalWithErrorCode = withErrorCode;
    if (!message && withErrorText) {
      const raw = d.getMessageText();
      let firstLine = "";
      if (typeof raw === "string") {
        firstLine = raw.split("\n")[0]?.trim() ?? "";
      } else {
        firstLine = raw.getMessageText().split("\n")[0]?.trim() ?? "";
      }
      // Truncate overly long error text to keep comment lines readable
      if (firstLine && firstLine.length > MAX_ERROR_TEXT_LENGTH) {
        const truncated = firstLine
          .slice(0, MAX_ERROR_TEXT_LENGTH)
          .replace(/\s+$/g, "");
        firstLine = `${truncated}…`;
      }
      if (firstLine) {
        if (withErrorCode) {
          // Embed the error code into the message to format as `TSXXXX: <text>`
          messageFromError = `TS${d.getCode()}: ${firstLine}`;
          finalWithErrorCode = false; // avoid duplicating the error code
        } else {
          messageFromError = firstLine;
        }
      }
    }

    const insertComment = buildComment({
      sourceFile,
      lineNumber,
      commentType: commentType,
      errorCode: d.getCode(),
      withErrorCode: finalWithErrorCode,
      message: message ?? messageFromError,
    });

    // Insert comment
    sourceTextArray.splice(
      lineNumber + insertedCommentCount - 1,
      0,
      insertComment,
    );

    // Increment comment counts
    insertedCommentCount += 1;
    listOfLineNumberWithErrors.push(lineNumber);
  }

  return {
    text: sourceTextArray.join("\n"),
    count: insertedCommentCount,
  };
};
