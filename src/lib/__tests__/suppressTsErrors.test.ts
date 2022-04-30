import { Project } from "ts-morph";
import { describe, it, expect } from "vitest";
import { suppressTsErrors } from "../suppressTsErrors";

describe("suppressTsErrors", () => {
  it.each([
    {
      text: `
        const a: string = 1;
      `,
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
      commentType: 1,
    },
    {
      text: `
        const a: number = 1;
      `,
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
      withErrorCode,
      expectedText,
      expectedCommentCount,
    }) => {
      const project = new Project({ compilerOptions: { strict: true } });
      const sourceFile = project.createSourceFile("target.ts", text);

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
