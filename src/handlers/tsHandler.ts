import { Project } from "ts-morph";
import { generateProgressBar } from "../lib/progressBar";
import { suppressTsErrors } from "../lib/suppressTsErrors";

export const tsHandler = ({
	tsconfigPath,
	commentType,
	errorCode,
}: DefaultOptions): number => {
	// Get all project files
	const project = new Project({ tsConfigFilePath: tsconfigPath });
	const sourceFiles = project.getSourceFiles();

	// Initialize progress bar
	const progressBar = generateProgressBar();
	progressBar.start(sourceFiles.length, 0);

	// Rewrite source in ts/tsx file with source with comment
	let insertedCommentCount = 0;
	for (const sourceFile of sourceFiles) {
		const { text: textWithComment, count: insertedCommentCountPerFile } =
			suppressTsErrors({
				sourceFile,
				commentType,
				withErrorCode: errorCode,
			});

		if (insertedCommentCountPerFile > 0) {
			sourceFile.replaceWithText(textWithComment);
			sourceFile.saveSync();
			insertedCommentCount += insertedCommentCountPerFile;
		}
		progressBar.increment();
	}

	progressBar.stop();
	return insertedCommentCount;
};
