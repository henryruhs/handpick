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

	return await fs.promises.readFile(absolutePath).then(content => helper.json.parse(content));
}

/**
 * write file
 *
 * @since 1.0.0
 *
 * @param {object} packageObject
 *
 * @return {Promise}
 */

async function writeFile(packageObject)
{
	const absolutePath = path.resolve(option.get('path'));
	const content = helper.json.stringify(packageObject);

	return await fs.promises.writeFile(absolutePath, content);
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
 * restore
 *
 * @since 1.0.0
 *
 * @param {object} packageObject
 *
 * @return {object}
 */

function restore(packageObject)
{
	const ignoreArray = option.get('ignoreArray');
	const resultObject = {};

	Object.keys(packageObject).map(packageValue =>
	{
		const originalValue = packageValue.substr(2);

		if (ignoreArray.includes(originalValue))
		{
			resultObject[originalValue] = packageObject[packageValue];
		}
		else if (!ignoreArray.includes(packageValue))
		{
			resultObject[packageValue] = packageObject[packageValue];
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

	let managerProcess = null;

	spinner.start(wordingObject.handpick + ' ' + targetArray.join(' / ') + ' ' + wordingObject.via + ' ' + manager.toUpperCase());
	readFile()
		.then(packageObject =>
		{
			writeFile(prepare(packageObject))
				.then(() =>
				{
					if (manager in managerObject)
					{
						managerProcess = spawn(manager, managerObject[manager],
						{
							cwd: path.dirname(option.get('path')),
							stdio: 'ignore',
							shell: true
						});
						readFile().then(packageObject => writeFile(restore(packageObject)));
						managerProcess.on('close', code => code === 0 ? spinner.succeed() : spinner.fail());
						managerProcess.on('error', () => null);
					}
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
		writeFile,
		prepare,
		restore
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
