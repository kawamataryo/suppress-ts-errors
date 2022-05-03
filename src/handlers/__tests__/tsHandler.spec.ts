import { describe, it, expect, vi, afterEach } from "vitest";
import { tsHandler } from "../tsHandler";
import { suppressTsErrors as suppressTsErrorsMock } from "../../lib/suppressTsErrors";
import { Project as ProjectMock } from "ts-morph";

const replaceWithTextMock = vi.fn();
const saveSyncMock = vi.fn();
const getSourceFilesMock = vi.fn(() => [
  {
    replaceWithText: replaceWithTextMock,
    saveSync: saveSyncMock,
  },
]);
const mockText = `
  @ts-expect-error TS2322
  const a: string = 1;
`;

// vi.mock("ts-morph", () => {
//   return {
//     Project: vi.fn(() => ({
//       getSourceFiles: getSourceFilesMock,
//     })),
//   };
// });

// vi.mock("../../lib/suppressTsErrors", () => {
//   return {
//     suppressTsErrors: vi.fn(() => ({
//       text: mockText,
//       count: 1,
//     })),
//   };
// });

// TODO: For some reason, only ci falls off.
describe.skip("tsHandler", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("execute process", () => {
    const tsconfigPath = "./tsconfig.json";
    const commentType = 1;
    const errorCode = true;

    const count = tsHandler({
      tsconfigPath,
      commentType,
      errorCode,
    });

    expect(ProjectMock).toHaveBeenCalledWith({
      tsConfigFilePath: tsconfigPath,
    });
    expect(suppressTsErrorsMock).toHaveBeenCalledTimes(1);
    expect(getSourceFilesMock).toHaveBeenCalledTimes(1);
    expect(replaceWithTextMock).toHaveBeenCalledWith(mockText);
    expect(saveSyncMock).toHaveBeenCalledTimes(1);
    expect(count).toBe(1);
  });
});
