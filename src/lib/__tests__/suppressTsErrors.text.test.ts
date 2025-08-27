import { Project, ts } from "ts-morph";
import { beforeAll, describe, expect, it } from "vitest";
import { suppressTsErrors } from "../suppressTsErrors";

describe("suppressTsErrors --text option", () => {
  let project: Project;
  beforeAll(() => {
    project = new Project({
      compilerOptions: { strict: true, jsx: ts.JsxEmit.React },
    });
  });

  it("adds first error line with code", () => {
    const text = `
      const a: string = 1;
    `;
    const sourceFile = project.createSourceFile("target.ts", text, {
      overwrite: true,
    });

    const result = suppressTsErrors({
      sourceFile,
      commentType: 1,
      withErrorCode: true,
      withErrorText: true,
    });

    expect(result.text).toContain(
      "// @ts-expect-error TS2322: Type 'number' is not assignable to type 'string'.",
    );
  });

  it("adds first error line without code when disabled", () => {
    const text = `
      const a: string = 1;
    `;
    const sourceFile = project.createSourceFile("target2.ts", text, {
      overwrite: true,
    });

    const result = suppressTsErrors({
      sourceFile,
      commentType: 1,
      withErrorCode: false,
      withErrorText: true,
    });

    expect(result.text).toContain(
      "// @ts-expect-error Type 'number' is not assignable to type 'string'.",
    );
  });
});
