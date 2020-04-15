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
	const absolutePath = path.resolve(option.get('path'));

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
	const absolutePath = path.resolve(option.get('path'));

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
	return resultObject;
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
	const targetArray = option.get('targetArray');

	let originalContent = null;
	let managerProcess = null;

	spinner.start(wordingObject.handpick + ' ' + targetArray.join(' / ') + ' ' + wordingObject.via + ' ' + manager.toUpperCase());
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
						cwd: path.dirname(option.get('path')),
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
