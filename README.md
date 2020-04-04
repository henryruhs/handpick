Handpick
========

> Handpick your node dependencies like a boss.

[![Build Status](https://img.shields.io/travis/redaxmedia/handpick.svg)](https://travis-ci.org/redaxmedia/handpick)
[![NPM Version](https://img.shields.io/npm/v/handpick.svg)](https://npmjs.com/package/handpick)
[![License](https://img.shields.io/npm/l/handpick.svg)](https://npmjs.com/package/handpick)


Installation
------------

Install the dependencies:

```
npm install handpick
```


Usage
-----

Run the command:

```
bin/handpick [options]

-V, --version
-M, --manager
-P, --package
-T, --target
-h, --help
```

Options
-------

| Name    | Type   | Default      | Mandatory |
|---------|--------|--------------|-----------|
| manager | string | npm          | optional  |
| package | string | package.json | optional  |
| target  | string | []           | required  |


Examples
--------

Define lint dependencies inside `package.json` file:

```json
{
	"lintDependencies":
	{
		"eslint": "1.0.0",
 		"eslint-config-redaxmedia": "1.3.0"
	}
}
```

Install the lint dependencies:

```
bin/handpick --target=lintDependencies
```

Install the dev and lint dependencies with YARN:

```
bin/handpick --manager=yarn --target=devDependencies --target=lintDependencies
```