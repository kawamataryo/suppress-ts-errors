import cliProgress from "cli-progress";
import _colors from "ansi-colors";

export const generateProgressBar = (): cliProgress.SingleBar =>
  new cliProgress.SingleBar(
    {
      format: `progress [${_colors.blue(
        "{bar}"
      )}] {percentage}% | {value}/{total}`,
    },
    cliProgress.Presets.rect
  );
