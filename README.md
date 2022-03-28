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

```json
{
	"lintDependencies":
	{
		"eslint": "8.0.0",
		"eslint-config-redaxmedia": "3.0.0"
	}
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


Documentation
-------------

Read the [documenation](https://redaxmedia.gitbook.io/handpick) for a deep dive.
