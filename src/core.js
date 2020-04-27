const fs = require('fs');
const spawn = require('child_process').spawn;
const path = require('path');
const helper = require('utility-redaxmedia').helper;
const wordingObject = require('../wording');

let spinner;
let option;

/**
 * read file
 *
 * @since 1.0.0
 *
 * @return {Promise}
 */

async function readFile()
{
	const absolutePath = path.resolve(option.get('path') + '/' + option.get('file'));

	return await fs.promises.readFile(absolutePath);
}

/**
 * read object from file
 *
 * @since 1.0.0
 *
 * @return {Promise}
 */

async function readObjectFromFile()
{
	return await readFile().then(content => helper.json.parse(content));
}

/**
 * write file
 *
 * @since 1.0.0
 *
 * @param {string} content
 *
 * @return {Promise}
 */

async function writeFile(content)
{
	const absolutePath = path.resolve(option.get('path') + '/' + option.get('file'));

	return await fs.promises.writeFile(absolutePath, content);
}

/**
 * write object to file
 *
 * @since 1.0.0
 *
 * @param {object} packageObject
 *
 * @return {Promise}
 */

async function writeObjectToFile(packageObject)
{
	return await writeFile(helper.json.stringify(packageObject));
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
	const filterObject = {};
	const resultObject = {};

	Object.keys(packageObject).map(packageValue =>
	{
		const prefixValue = option.get('prefix') + packageValue;

		if (ignoreArray.includes(packageValue))
		{
			resultObject[prefixValue] = packageObject[packageValue];
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
	const wordingArray =
	[
		wordingObject.handpick,
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

	let originalContent = null;
	let managerProcess = null;

	spinner.start(startWording());
	readFile()
		.then(content =>
		{
			originalContent = content;
			return helper.json.parse(content);
		})
		.then(packageObject =>
		{
			writeObjectToFile(prepare(packageObject))
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
						writeFile(originalContent)
							.then(code === 0 ? spinner.succeed() : spinner.fail())
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
		readFile,
		readObjectFromFile,
		writeFile,
		writeObjectToFile,
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
