import { existsSync } from "node:fs";
import colors from "ansi-colors";

export const tsconfigExists = (argv: { tsconfigPath: string }): boolean => {
  if (!existsSync(argv.tsconfigPath)) {
    throw new Error(colors.red(`${argv.tsconfigPath} does not exist`));
  }
  return true;
};

export const isVueFiles = (argv: { targetFilePaths: string[] }) => {
  const targetFilePaths = argv.targetFilePaths;
  if (targetFilePaths.some((f) => !f.endsWith(".vue"))) {
    throw new Error(
      colors.red("Error: A non-vue file is passed as the target file."),
    );
  }
  return true;
};
