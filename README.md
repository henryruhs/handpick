Handpick
========

> Handpick conditional dependencies like a boss.

[![Build Status](https://img.shields.io/github/actions/workflow/status/henryruhs/handpick/ci.yml.svg?branch=master)](https://github.com/henryruhs/handpick/actions?query=workflow:ci)
[![Coverage Status](https://coveralls.io/repos/github/henryruhs/handpick/badge.svg)](https://coveralls.io/github/henryruhs/handpick)
[![NPM Version](https://img.shields.io/npm/v/handpick.svg)](https://npmjs.com/package/handpick)
[![License](https://img.shields.io/npm/l/handpick.svg)](https://npmjs.com/package/handpick)


Preview
-------

![Terminal Session](https://raw.githubusercontent.com/henryruhs/handpick/master/.github/terminal-session.svg?sanitize=true)


Installation
------------

Install on your system:

```
npm install handpick --global
```


Setup
-----

Define unofficial dependencies:

```json
{
	"lintDependencies":
	{
		"@isnotdefined/eslint-config": "7.2.0",
		"eslint": "8.31.0"
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

Read the [documenation](https://henryruhs.gitbook.io/handpick) for a deep dive.
