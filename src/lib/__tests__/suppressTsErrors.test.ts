import { Project } from "ts-morph";
import { describe, it, expect, beforeAll } from "vitest";
import { suppressTsErrors } from "../suppressTsErrors";

describe("suppressTsErrors", () => {
  let project: Project;
  beforeAll(() => {
    project = new Project({ compilerOptions: { strict: true } });
  });

  it.each([
    {
      text: `
        const a: string = 1;
      `,
      fileName: "target.ts",
      commentType: 1,
      withErrorCode: false,
      expectedText: `
        // @ts-expect-error
        const a: string = 1;
      `,
      expectedCommentCount: 1,
    },
    {
      text: `
        const a: string = 1;
      `,
      fileName: "target.ts",
      commentType: 1,
      withErrorCode: true,
      expectedText: `
        // @ts-expect-error TS2322
        const a: string = 1;
      `,
      expectedCommentCount: 1,
    },
    {
      text: `
        const func = (num: number) => num
        func('a')
      `,
      fileName: "target.ts",
      commentType: 2,
      withErrorCode: false,
      expectedText: `
        const func = (num: number) => num
        // @ts-ignore
        func('a')
      `,
      expectedCommentCount: 1,
    },
    {
      text: `
        const func = (num: number) => num
        func('a')

        let a: string = 1;
      `,
      fileName: "target.ts",
      commentType: 1,
      withErrorCode: true,
      expectedText: `
        const func = (num: number) => num
        // @ts-expect-error TS2345
        func('a')

        // @ts-expect-error TS2322
        let a: string = 1;
      `,
      expectedCommentCount: 2,
    },
    {
      text: `
        const func = (num: number) => {
          return num.map(r => 1)
        }
      `,
      fileName: "target.ts",
      commentType: 1,
      withErrorCode: true,
      expectedText: `
        const func = (num: number) => {
          // @ts-expect-error TS2339
          return num.map(r => 1)
        }
      `,
      expectedCommentCount: 1,
    },
    {
      text: `
        const func = (num) => {
          return num
        }
      `,
      expectedCommentCount: 1,
      withErrorCode: false,
      expectedText: `
        // @ts-expect-error
        const func = (num) => {
          return num
        }
      `,
      fileName: "target.ts",
      commentType: 1,
    },
    {
      text: `
        function tsxFunc(num: number) {
          return <div>{num.map(n => n)}</div>
        }
      `,
      fileName: "target.tsx",
      commentType: 1,
      withErrorCode: true,
      expectedText: `
        function tsxFunc(num: number) {
          // @ts-expect-error TS7026
          return <div>{num.map(n => n)}</div>
        }
      `,
      expectedCommentCount: 1,
    },
    {
      text: `
        function tsxFunc(num: number) {
          return (
            <div>{num.map(n => n)}</div>
          )
        }
      `,
      fileName: "target.tsx",
      commentType: 1,
      withErrorCode: true,
      expectedText: `
        function tsxFunc(num: number) {
          return (
            {/*
             // @ts-expect-error TS7026 */}
            <div>{num.map(n => n)}</div>
          )
        }
      `,
      expectedCommentCount: 1,
    },
    {
      text: `
        const a: number = 1;
      `,
      fileName: "target.ts",
      commentType: 1,
      withErrorCode: true,
      expectedText: `
        const a: number = 1;
      `,
      expectedCommentCount: 0,
    },
  ])(
    "suppress ts error",
    ({
      text,
      commentType,
      fileName,
      withErrorCode,
      expectedText,
      expectedCommentCount,
    }) => {
      const sourceFile = project.createSourceFile(fileName, text, {
        overwrite: true,
      });

      const result = suppressTsErrors({
        sourceFile,
        commentType: commentType as CommentType,
        withErrorCode,
      });

      expect(result.text).toBe(expectedText);
      expect(result.count).toBe(expectedCommentCount);
    }
  );
});
