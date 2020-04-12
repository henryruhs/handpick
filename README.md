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
-M, --manager
-P, --path
-h, --help
```


Options
-------

| Name    | Type    | Default                        | Mandatory |
|---------|---------|--------------------------------|-----------|
| target  | string  | dependencies / devDependencies | optional  |
| manager | string  | npm                            | optional  |
| path    | string  | package.json                   | optional  |


Examples
--------

Define lint dependencies inside `package.json` file:

```json
{
	"lintDependencies":
	{
		"eslint": "6.8.0",
		"eslint-config-redaxmedia": "2.0.0"
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

Install the `dependencies` and `devDependencies` within path:

```
handpick --path=../package.json
```


Managers
--------

| Name | Value |
|------|-------|
| NPM  | npm   |
| PNPM | pnpm  |
| YARN | yarn  |
