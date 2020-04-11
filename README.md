Handpick
========

> Handpick conditional dependencies like a boss.

[![Build Status](https://img.shields.io/travis/redaxmedia/handpick.svg)](https://travis-ci.org/redaxmedia/handpick)
[![NPM Version](https://img.shields.io/npm/v/handpick.svg)](https://npmjs.com/package/handpick)
[![License](https://img.shields.io/npm/l/handpick.svg)](https://npmjs.com/package/handpick)


Preview
-------

![Terminal Session](https://raw.githack.com/redaxmedia/handpick/master/.github/terminal-session.svg)


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
-M, --manager
-P, --path
-T, --target
-h, --help
```


Options
-------

| Name    | Type    | Default                        | Mandatory |
|---------|---------|--------------------------------|-----------|
| manager | string  | npm                            | optional  |
| path    | string  | package.json                   | optional  |
| target  | string  | dependencies / devDependencies | optional  |


Examples
--------

Define lint dependencies inside `package.json` file:

```json
{
	"lintDependencies":
	{
		"eslint": "6.0.0",
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
handpick --manager=yarn --target=devDependencies --target=lintDependencies
```

Install the `dependencies` and `devDependencies` within path:

```
handpick --path=../package.json
```
