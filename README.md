Handpick
========

> Handpick conditional dependencies like a boss.

[![Build Status](https://img.shields.io/travis/redaxmedia/handpick.svg)](https://travis-ci.org/redaxmedia/handpick)
[![NPM Version](https://img.shields.io/npm/v/handpick.svg)](https://npmjs.com/package/handpick)
[![License](https://img.shields.io/npm/l/handpick.svg)](https://npmjs.com/package/handpick)


Preview
-------

![Terminal Session](https://raw.githubusercontent.com/redaxmedia/handpick/master/.github/terminal-session.svg?sanitize=true)


Installation
------------

Install on your system:

```
npm install handpick --global
```


Usage
-----

Run the command:

```
handpick [options]

-V, --version
-T, --target
-F, --filter
-M, --manager
-P, --path
-h, --help
```


Options
-------

| Name    | Type    | Default                        | Mandatory |
|---------|---------|--------------------------------|-----------|
| target  | string  | dependencies / devDependencies | optional  |
| filter  | string  |                                | optional  |
| manager | string  | npm                            | optional  |
| path    | string  | .                              | optional  |


Examples
--------

Define unofficial dependencies inside `package.json` file:

```json
{
	"lintDependencies":
	{
		"eslint": "6.8.0",
		"eslint-config-redaxmedia": "2.0.0"
	},
	"testDependencies":
	{
		"chai": "4.2.0",
		"mocha": "7.1.1"
	}
}
```

Install the `lintDependencies`:

```
handpick --target=lintDependencies
```

Install the `devDependencies` and `lintDependencies` via YARN:

```
handpick --target=devDependencies --target=lintDependencies --manager=yarn
```

Install the `devDependencies` without `testDependencies`:

```
handpick --target=devDependencies --filter=testDependencies
```

Install the `dependencies` and `devDependencies` within path:

```
handpick --path=../shared
```


Managers
--------

| Name | Value |
|------|-------|
| NPM  | npm   |
| PNPM | pnpm  |
| YARN | yarn  |
