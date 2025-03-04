Handpick
========

> Handpick conditional dependencies like a boss.

[![Build Status](https://img.shields.io/github/actions/workflow/status/henryruhs/handpick/ci.yml.svg?branch=master)](https://github.com/henryruhs/handpick/actions?query=workflow:ci)
[![Coverage Status](https://img.shields.io/coveralls/henryruhs/handpick.svg)](https://coveralls.io/r/henryruhs/handpick)
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
		"@isnotdefined/eslint-config": "10.0.0",
		"eslint": "9.19.0"
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
