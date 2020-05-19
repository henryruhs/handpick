Handpick
========

> Handpick conditional dependencies like a boss.

[![Build Status](https://img.shields.io/travis/redaxmedia/handpick.svg)](https://travis-ci.org/redaxmedia/handpick)
[![Coverage Status](https://coveralls.io/repos/github/redaxmedia/handpick/badge.svg)](https://coveralls.io/github/redaxmedia/handpick)
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

Setup
-----

Create a `.handpick` file to override configuration:

```json
{
	"manager": "npm",
	"managerObject":
	{
		"npm":
		[
			"install",
			"--no-package-lock"
		],
		"pnpm":
		[
			"install",
			"--no-lockfile"
		],
		"yarn":
		[
			"--no-lockfile"
		]
	},
	"path": ".",
	"file": "package.json",
	"ignoreArray":
	[
		"dependencies",
		"devDependencies"
	],
	"targetArray":
	[
		"dependencies",
		"devDependencies"
	],
	"filterArray": [],
	"prefix": "__"
}
```


Usage
-----

Run the command:

```
handpick [options]

-V, --version
-C, --config <config>
-T, --target <target>
-F, --filter <filter>
-M, --manager <manager>
-P, --path <path>
-h, --help
```


Options
-------

| Name    | Type    | Default                        | Mandatory |
|---------|---------|--------------------------------|-----------|
| config  | string  | .handpick                      | optional  |
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
		"eslint": "7.0.0",
		"eslint-config-redaxmedia": "2.1.0"
	},
	"testDependencies":
	{
		"chai": "4.2.0",
		"mocha": "7.1.2"
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
