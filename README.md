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
handpick [options] [path]

-c, --config <config>
-t, --target <target>
-f, --filter <target>
-m, --manager <manager>
-r, --range <range>
-v, --version
-h, --help
```


Documentation
-------------

Read the [documentation](https://henryruhs.gitbook.io/handpick) for a deep dive.
