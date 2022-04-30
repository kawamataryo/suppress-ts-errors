import { describe, it, expect } from "vitest";
// @ts-exepect-error (Cannot find module '../convertToCommentedCode' or its corresponding type declarations.)
import { convertToCommentedCode } from "../convertToCommentedCode";

describe("convertToCommentedCode", () => {
  it.each([
    {
      code: `
        const a: string = 1;
      `,
      expected: `
        // @ts-expect-error
        const a: string = 1;
      `,
      comment: "@ts-expect-error",
      withErrorMessage: false,
    },
    {
      code: `
        const a: string = 1;
      `,
      expected: `
        // @ts-expect-error (Type 'number' is not assignable to type 'string'.)
        const a: string = 1;
      `,
      comment: "@ts-expect-error",
      withErrorMessage: true,
    },
    {
      code: `
        const func = (num: number) => num
        func('a')
      `,
      expected: `
        const func = (num: number) => num
        // @ts-ignore
        func('a')
      `,
      comment: "@ts-ignore",
      withErrorMessage: false,
    },
    {
      code: `
        const func = (num: number) => num
        func('a')

        let a: string = 1;
      `,
      expected: `
        const func = (num: number) => num
        // @ts-expect-error (Argument of type 'string' is not assignable to parameter of type 'number'.)
        func('a')

        // @ts-expect-error (Type 'number' is not assignable to type 'string'.)
        let a: string = 1;
      `,
      comment: "@ts-expect-error",
      withErrorMessage: true,
    },
    {
      code: `
        const func = (num: number) => {
          return num.map(r => 1)
        }
      `,
      expected: `
        const func = (num: number) => {
          // @ts-expect-error (Property 'map' does not exist on type 'number'.)
          return num.map(r => 1)
        }
      `,
      comment: "@ts-expect-error",
      withErrorMessage: true,
    },
    {
      code: `
        const func = (num) => {
          return num
        }
      `,
      expected: `
        // @ts-expect-error
        const func = (num) => {
          return num
        }
      `,
      comment: "@ts-expect-error",
      withErrorMessage: false,
    },
    {
      code: `
        const a: number = 1;
      `,
      expected: `
        const a: number = 1;
      `,
      comment: "@ts-expect-error",
      withErrorMessage: true,
    },
  ])(
    "convert with commented code",
    ({ code, expected, comment, withErrorMessage }) => {
      const result = convertToCommentedCode({
        code,
        comment,
        withErrorMessage,
        compilerOptions: { strict: true },
      });

      expect(result).toBe(expected);
    }
  );
});
