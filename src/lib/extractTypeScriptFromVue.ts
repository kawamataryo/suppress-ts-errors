import { parse } from "@vue/compiler-sfc";

export const extractTypeScriptFromVue = (source: string): string => {
	const { descriptor } = parse(source);
	const script = descriptor.script || descriptor.scriptSetup;

	return script && script.lang === "ts" ? script.content : "";
};
