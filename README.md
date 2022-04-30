# suppress-ts-errors

[![CI](https://github.com/kawamataryo/suppress-ts-errors/actions/workflows/ci.yml/badge.svg)](https://github.com/kawamataryo/suppress-ts-errors/actions/workflows/ci.yml)

Cli tool to add comments to suppress typescript type errors.

## 🛠 Usage

**Run**

```bash
$ npx suppress-ts-errors
```

**options**

| option                | default           | description                                                                                                                                                                                                                                                                                                                        |
| --------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| -p, --tsconfig-path   | `./tsconfig.json` | Path to tsconfig.json.                                                                                                                                                                                                                                                                                                             |
| -t, --comment-type    | `1`               | Choice of inserted comment type. `1` is [@ts-expected-error](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#-ts-expect-error-comments), `2` is [@ts-ignore](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html#suppress-errors-in-ts-files-using--ts-ignore-comments). |
| -c, --with-error-code | `true`            | Add error code to comment. e.g. TS2345.                                                                                                                                                                                                                                                                                            |

## 📄 License

vue-word-highlighter is available under the MIT License.

## 🛣️ Road map

- [x] Extract main logic from clit.ts and add unit test.
- [x] Arrange README. Add Options and Usage.
- [ ] release to npm
- [ ] Support for `.tsx`.
- [ ] Support for `.vue`.
