# Contribution Guide

This is a guide on how to contribute to suppress-ts-errors.  
Contributions are welcome 🎉

## Issues

The following Issue is accepted.

- Questions about features
- Report errors or problems
- Propose additions or improvements to feature

Please click [here](https://github.com/kawamataryo/suppress-ts-errors/issues/new) to issue.

## Pull Request

Pull requests are always welcome.

The following types of Pull Requests are accepted. For basic Pull Requests (especially minor ones), you may send a Pull Request without creating an Issue.

- Bug Fixes
- Add functionality
- Performance Fixes
- Typo Fixes

"How about this kind of fix/improvement?" If you have a question, please raise an Issue and discuss it with me.

## How to send Pull Request

Please follow these steps to create a pull request.

1. Fork the repository
2. Create a branch
3. Add or modify feature
4. Run e2e and unit test
5. Check the feature in your browser
6. Commit Changes
7. Push branch
8. Create Pull Request

Also, when creating a pull request, please keep the following in mind

- **One pull request per feature** - If you want to do more than one thing, send multiple pull requests.
- **Add tests!** - If you add a feature, it would be great if you could write a test for it.
- **Keep the same style** - eslint will automatically be ran before committing
- **Document any change in behavior** - Make sure the `README.md` and any other relevant documentation are kept up-to-date.
- **Send coherent history** - Make sure your commits message means something

## How to set up a Local Development Environment

First, clone the forked repository locally.

```bash
$ git clone git@github.com:foo/suppress-ts-errors.git
```

Install dependent modules with [yarn](https://yarnpkg.com/).
If you do not have yarn, please install it beforehand.

```bash
$ yarn i
```

Run unit test with watch mode.

```bash
$ yarn test
```

That's it. Happy coding 👍
