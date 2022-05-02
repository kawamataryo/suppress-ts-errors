import cliProgress from "cli-progress";
import colors from "ansi-colors";

export const generateProgressBar = (
  colorFunc: colors.StyleFunction = colors.blue
): cliProgress.SingleBar =>
  new cliProgress.SingleBar(
    {
      format: `progress [${colorFunc(
        "{bar}"
      )}] {percentage}% | {value}/{total}`,
    },
    cliProgress.Presets.rect
  );
