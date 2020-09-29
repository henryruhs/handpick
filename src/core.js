const semver = require('semver');
const { promisify } = require('util');
const fs = require('fs');
const spawn = require('child_process').spawn;
const path = require('path');
const helper = require('utility-redaxmedia').helper;
const wordingObject = require('../wording');

let spinner;
let option;

/**
 * read the package file
 *
 * @since 1.0.0
 *
 * @return {Promise}
 */

async function readPackageFile()
{
	const absolutePath = path.resolve(option.get('path') + '/' + option.get('packageFile'));
	const readFileAsync = promisify(fs.readFile);

	return await readFileAsync(absolutePath);
}

/**
 * read object from the package file
 *
 * @since 1.0.0
 *
 * @return {Promise}
 */

async function readObjectFromPackageFile()
{
	return await readPackageFile().then(content => helper.json.parse(content));
}

/**
 * write the package file
 *
 * @since 1.0.0
 *
 * @param {string} content
 *
 * @return {Promise}
 */

async function writePackageFile(content)
{
	const absolutePath = path.resolve(option.get('path') + '/' + option.get('packageFile'));
	const writeFileAsync = promisify(fs.writeFile);

	return await writeFileAsync(absolutePath, content);
}

/**
 * write object to the package file
 *
 * @since 1.0.0
 *
 * @param {object} packageObject
 *
 * @return {Promise}
 */

async function writeObjectToPackageFile(packageObject)
{
	return await writePackageFile(helper.json.stringify(packageObject));
}

/**
 * count the package directory
 *
 * @since 3.1.0
 *
 * @return {number}
 */

function countPackageDirectory()
{
	const absolutePath = path.resolve(option.get('path') + '/' + option.get('packageDirectory'));

	return fs.existsSync(absolutePath) ? fs.readdirSync(absolutePath).length : 0;
}

/**
 * prepare
 *
 * @since 1.0.0
 *
 * @param {object} packageObject
 *
 * @return {object}
 */

function prepare(packageObject)
{
	const ignoreArray = option.get('ignoreArray');
	const targetArray = option.get('targetArray');
	const filterArray = option.get('filterArray');
	const range = option.get('range');
	const filterObject = {};
	const resultObject = {};

	/* handle prefix */

	Object.keys(packageObject).map(packageValue =>
	{
		const ignorePrefix = option.get('ignorePrefix') + packageValue;

		if (ignoreArray.includes(packageValue))
		{
			resultObject[ignorePrefix] = packageObject[packageValue];
		}
		else
		{
			resultObject[packageValue] = packageObject[packageValue];
		}
		if (targetArray.includes(packageValue))
		{
			resultObject['dependencies'] =
			{
				...resultObject['dependencies'],
				...packageObject[packageValue]
			};
		}
	});

	/* handle filter */

	filterArray.map(filterValue =>
	{
		Object.keys(resultObject['dependencies']).filter(resultValue =>
		{
			if (packageObject[filterValue] && !Object.keys(packageObject[filterValue]).includes(resultValue))
			{
				filterObject[resultValue] = resultObject['dependencies'][resultValue];
			}
		});
		resultObject['dependencies'] = filterObject;
	});

	/* handle range */

	Object.keys(resultObject['dependencies']).map(resultValue =>
	{
		const coerceObject = semver.coerce(resultObject['dependencies'][resultValue]);
		const version = coerceObject ? coerceObject.version : null;

		if (range === 'exact' && version)
		{
			resultObject['dependencies'][resultValue] = version;
		}
		if (range === 'patch' && version)
		{
			resultObject['dependencies'][resultValue] = '~' + version;
		}
		if (range === 'minor' && version)
		{
			resultObject['dependencies'][resultValue] = '^' + version;
		}
	});
	return resultObject;
}

/**
 * start wording
 *
 * @since 1.5.0
 *
 * @return {string}
 */

function startWording()
{
	const manager = option.get('manager');
	const targetArray = option.get('targetArray');
	const filterArray = option.get('filterArray');
	const range = option.get('range');
	const wordingArray =
	[
		wordingObject.handpick,
		range.toUpperCase(),
		targetArray.join(' ' + wordingObject.and + ' ')
	];

	if (filterArray.length > 0)
	{
		wordingArray.push(wordingObject.without, filterArray.join(' ' + wordingObject.and + ' '));
	}
	wordingArray.push(wordingObject.via, manager.toUpperCase());
	return wordingArray.join(' ');
}

/**
 * end wording
 *
 * @since 3.1.0
 *
 * @param {number} startTime
 * @param {number} endTime
 * @param {number} startPackage
 * @param {number} endPackage
 *
 * @return {string}
 */

function endWording(startTime, endTime, startPackage, endPackage)
{
	const resultTime = (endTime - startTime) / 1000;
	const resultPackage = endPackage - startPackage;
	const wordingArray =
	[
		wordingObject.done,
		resultPackage,
		resultPackage > 1 ? wordingObject.packages : wordingObject.package,
		wordingObject.in,
		resultTime.toFixed(2),
		resultTime > 1 ? wordingObject.seconds : wordingObject.second
	];

	return wordingArray.join(' ');
}

/**
 * init
 *
 * @since 1.0.0
 *
 * @return {void}
 */

function init()
{
	const manager = option.get('manager');
	const managerObject = option.get('managerObject');
	const startTime = Date.now();
	const startPackage = countPackageDirectory();

	let originalContent = null;
	let managerProcess = null;

	spinner.start(startWording());
	readPackageFile()
		.then(content =>
		{
			originalContent = content;
			return helper.json.parse(content);
		})
		.then(packageObject =>
		{
			writeObjectToPackageFile(prepare(packageObject))
				.then(() =>
				{
					managerProcess = spawn(manager, managerObject[manager],
					{
						cwd: option.get('path'),
						stdio: 'ignore',
						shell: true
					});
					managerProcess.on('close', code =>
					{
						writePackageFile(originalContent)
							.then(code === 0 ? spinner.succeed() : spinner.fail())
							.then(spinner.info(endWording(startTime, Date.now(), startPackage, countPackageDirectory())))
							.catch(error => spinner.fail(error.toString()));
					});
					managerProcess.on('error', () => null);
					[
						'SIGHUP',
						'SIGINT',
						'SIGQUIT',
						'SIGTERM',
						'uncaughtException'
					].forEach((eventType) =>
					{
						process.on(eventType, () => managerProcess.emit('error',
						{
							code: 1
						}));
					});
				})
				.catch(error => spinner.fail(error.toString()));
		})
		.catch(error => spinner.fail(error.toString()));
}

/**
 * construct
 *
 * @since 1.0.0
 *
 * @param {object} injectorObject
 *
 * @return {object}
 */

function construct(injectorObject)
{
	const exports =
	{
		init,
		startWording,
		endWording,
		readPackageFile,
		readObjectFromPackageFile,
		writePackageFile,
		writeObjectToPackageFile,
		prepare
	};

	/* handle injector */

	if (injectorObject.option && injectorObject.option)
	{
		spinner = injectorObject.spinner;
		option = injectorObject.option;
	}
	return exports;
}

module.exports = construct;
