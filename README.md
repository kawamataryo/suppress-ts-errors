# suppress-ts-errors

[![CI](https://github.com/kawamataryo/suppress-ts-errors/actions/workflows/ci.yml/badge.svg)](https://github.com/kawamataryo/suppress-ts-errors/actions/workflows/ci.yml)
<a href="https://npmcharts.com/compare/suppress-ts-errors?minimal=true"><img src="https://img.shields.io/npm/dt/suppress-ts-errors.svg" alt="Downloads"></a>
<a href="https://www.npmjs.com/package/suppress-ts-errors"><img src="https://img.shields.io/npm/v/suppress-ts-errors.svg" alt="Version"></a>
<a href="https://www.npmjs.com/package/suppress-ts-errors"><img src="https://img.shields.io/npm/l/suppress-ts-errors.svg" alt="License"></a>
<a href="https://github.com/kawamataryo/suppress-ts-errors" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/kawamataryo/suppress-ts-errors?style=social"></a>

Cli tool to add comments to suppress typescript type errors.

![Kapture 2022-05-01 at 15 35 50](https://user-images.githubusercontent.com/11070996/166135217-82e23b1e-7c9f-40c3-88ad-985b021b842a.gif)


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
