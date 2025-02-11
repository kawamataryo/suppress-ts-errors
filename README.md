# suppress-ts-errors

[![CI](https://github.com/kawamataryo/suppress-ts-errors/actions/workflows/ci.yml/badge.svg)](https://github.com/kawamataryo/suppress-ts-errors/actions/workflows/ci.yml)
<a href="https://npmcharts.com/compare/suppress-ts-errors?minimal=true"><img src="https://img.shields.io/npm/dt/suppress-ts-errors.svg" alt="Downloads"></a>
<a href="https://www.npmjs.com/package/suppress-ts-errors"><img src="https://img.shields.io/npm/v/suppress-ts-errors.svg" alt="Version"></a>
<a href="https://www.npmjs.com/package/suppress-ts-errors"><img src="https://img.shields.io/npm/l/suppress-ts-errors.svg" alt="License"></a>
<a href="https://github.com/kawamataryo/suppress-ts-errors" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/kawamataryo/suppress-ts-errors?style=social"></a>

Cli tool to add comments to suppress typescript type errors.  
Add [@ts-expect-error](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#-ts-expect-error-comments) or [@ts-ignore](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html#suppress-errors-in-ts-files-using--ts-ignore-comments) comments to all locations where errors are occurring.  
Support for `.ts`, `.tsx`, `.vue`.

![Kapture 2022-05-01 at 15 35 50](https://user-images.githubusercontent.com/11070996/166135217-82e23b1e-7c9f-40c3-88ad-985b021b842a.gif)

## 🚀 Usage

### Running scripts to `.ts` and `.tsx`

Run the script in the directory where `tsconfig.json` is located.

```bash
$ npx suppress-ts-errors
```

### Running scripts to `.vue`

When targeting vue sfc, the path of the vue component must be specified with the glob pattern.  
**Notice:** It does not support commenting out type errors in the `<template>` section of vue, only the `<script>` section.

```bash
$ npx suppress-ts-errors vue src/**/*.vue
```

### options

| option              | default           | description                                                                                                                                                                                                                                                                                                                           |
| ------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| -t, --tsconfig-path | `./tsconfig.json` | Path to tsconfig.json.                                                                                                                                                                                                                                                                                                                |
| -c, --comment-type  | `1`               | Choice of inserted comment type. <br> `1` is [@ts-expect-error](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#-ts-expect-error-comments), `2` is [@ts-ignore](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html#suppress-errors-in-ts-files-using--ts-ignore-comments). |
| -e, --error-code    | `true`            | Add error code to comment. e.g. TS2345.                                                                                                                                                                                                                                                                                               |
| -g, --glob          | `undefined`       | Add a specific glob for error suppression (prevents script from processing all files and their dependencies)                                                                                                                                                                                                                          |
| -m, --message       | `undefined`       | Add a custom message to the comment.                                                                                                                                                                                                                                                                                                    |

## ✨ Contributing

Contributions are welcome 🎉  
We accept contributions via Pull Requests. See [this guide](https://github.com/kawamataryo/suppress-ts-errors/blob/main/CONTRIBUTING.md) on how to make a contribution.

## 📄 License

suppress-ts-errors is available under the MIT License.
