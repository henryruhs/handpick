Handpick
========

> Handpick conditional dependencies like a boss.

[![Build Status](https://img.shields.io/github/workflow/status/redaxmedia/handpick/ci.svg)](https://github.com/redaxmedia/handpick/actions?query=workflow:ci)
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
	"config": ".handpick",
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
	"range": "dirty",
	"rangeArray":
	[
		"dirty",
		"exact",
		"patch",
		"minor"
	],
	"ignorePrefix": "__",
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
	"spinnerTime": 40,
	"spinnerArray":
	[
		"⠋",
		"⠙",
		"⠹",
		"⠸",
		"⠼",
		"⠴",
		"⠦",
		"⠧",
		"⠇",
		"⠏"
	],
	"path": ".",
	"packageFile": "package.json",
	"packageDirectory": "node_modules"
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
-R, --range <range>
-P, --path <path>
-h, --help
```


Options
-------

| Name    | Type   | Default                        | Mandatory |
|---------|--------|--------------------------------|-----------|
| config  | string | .handpick                      | optional  |
| target  | string | dependencies / devDependencies | optional  |
| filter  | string |                                | optional  |
| manager | string | npm                            | optional  |
| range   | string | dirty                          | optional  |
| path    | string | .                              | optional  |


Examples
--------

Define unofficial dependencies inside `package.json` file:

```json
{
	"lintDependencies":
	{
		"eslint": "6.8.0",
		"eslint-config-redaxmedia": "2.1.0"
	},
	"testDependencies":
	{
		"chai": "4.2.0",
		"mocha": "7.2.0"
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

Install the `dependencies` with `exact` range:

```
handpick --target=dependencies --range=exact
```


Managers
--------

| Name | Value |
|------|-------|
| NPM  | npm   |
| PNPM | pnpm  |
| YARN | yarn  |
