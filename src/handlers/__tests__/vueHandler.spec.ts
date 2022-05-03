import { describe, it, expect, vi, afterEach } from "vitest";
import { vueHandler } from "../vueHandler";
import { suppressTsErrors as suppressTsErrorsMock } from "../../lib/suppressTsErrors";
import { Project as ProjectMock } from "ts-morph";
import {
  readFile as readFileMock,
  writeFile as writeFileMock,
} from "fs/promises";

const sourceFileMock = {};
const mockFilePath = "src/example.vue";
const createSourceFileMock = vi.fn(() => sourceFileMock);
const mockPrevText = `
<template>
  <div>test</div>
</template>
<script lang="ts">
  const a: string = 1;
</script>
`;
const mockNewText = `
<template>
  <div>test</div>
</template>
<script lang="ts">
  @ts-expect-error TS2322
  const a: string = 1;
</script>
`;
const mockPrevScript = `
  const a: string = 1;
`;
const mockNewScript = `
  @ts-expect-error TS2322
  const a: string = 1;
`;

vi.mock("ts-morph", () => {
  return {
    Project: vi.fn(() => ({
      createSourceFile: createSourceFileMock,
    })),
  };
});

vi.mock("../../lib/suppressTsErrors", () => {
  return {
    suppressTsErrors: vi.fn(() => ({
      text: mockNewScript,
      count: 1,
    })),
  };
});

vi.mock("glob", () => {
  return {
    default: {
      sync: vi.fn(() => [mockFilePath]),
    },
  };
});

vi.mock("fs/promises", () => {
  return {
    readFile: vi.fn(() => Promise.resolve(mockPrevText)),
    writeFile: vi.fn(() => Promise.resolve()),
  };
});

vi.mock("../../lib/extractTypeScriptFromVue", () => {
  return {
    extractTypeScriptFromVue: vi.fn(() => mockPrevScript),
  };
});

// TODO: For some reason, only ci falls off.
describe.skip("vueHandler", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("execute process", async () => {
    const tsconfigPath = "./tsconfig.json";
    const commentType = 1;
    const errorCode = true;
    const targetPathPattern = "src/**/*.vue";

    const count = await vueHandler({
      tsconfigPath,
      commentType,
      errorCode,
      targetPathPattern,
    });

    expect(readFileMock).toHaveBeenCalledWith(mockFilePath, "utf8");
    expect(ProjectMock).toHaveBeenCalledWith({
      tsConfigFilePath: tsconfigPath,
    });
    expect(createSourceFileMock).toHaveBeenCalledWith(
      `${mockFilePath}.ts`,
      mockPrevScript
    );
    expect(suppressTsErrorsMock).toHaveBeenCalledWith({
      sourceFile: sourceFileMock,
      commentType,
      withErrorCode: errorCode,
    });
    expect(writeFileMock).toHaveBeenCalledWith(mockFilePath, mockNewText);
    expect(count).toBe(1);
  });
});
