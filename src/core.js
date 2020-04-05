const fs = require('fs');
const spawn = require('child_process').spawn;
const path = require('path');
const wordingArray = require('../wording');

let spinner;
let option;

/**
 * read file
 *
 * @since 1.0.0
 *
 * @return Promise
 */

async function readFile()
{
	const absolutePath = path.resolve(option.get('path'));

	return await fs.promises.readFile(absolutePath).then(content => JSON.parse(content));
}

/**
 * write file
 *
 * @since 1.0.0
 *
 * @param packageArray
 *
 * @return Promise
 */

async function writeFile(packageArray)
{
	const absolutePath = path.resolve(option.get('path'));
	const content = JSON.stringify(packageArray, null, option.get('indent'));

	return await fs.promises.writeFile(absolutePath, content);
}

/**
 * prepare
 *
 * @since 1.0.0
 *
 * @param packageArray
 *
 * @return object
 */

function prepare(packageArray)
{
	const ignoreArray = option.get('ignoreArray');
	const targetArray = option.get('targetArray');
	const resultArray = {};

	Object.keys(packageArray).map(packageValue =>
	{
		const prefixValue = option.get('prefix') + packageValue;

		if (ignoreArray.includes(packageValue))
		{
			resultArray[prefixValue] = packageArray[packageValue];
		}
		else
		{
			resultArray[packageValue] = packageArray[packageValue];
		}
		if (targetArray.includes(packageValue))
		{
			resultArray['dependencies'] =
			{
				...resultArray['dependencies'],
				...packageArray[packageValue]
			};
		}
	});
	return resultArray;
}

/**
 * restore
 *
 * @since 1.0.0
 */

function restore(packageArray)
{
	const ignoreArray = option.get('ignoreArray');
	const resultArray = {};

	Object.keys(packageArray).map(packageValue =>
	{
		const originalValue = packageValue.substr(2);

		if (ignoreArray.includes(originalValue))
		{
			resultArray[originalValue] = packageArray[packageValue];
		}
		else if (!ignoreArray.includes(packageValue))
		{
			resultArray[packageValue] = packageArray[packageValue];
		}
	});
	return resultArray;
}

/**
 * init
 *
 * @since 1.0.0
 */

function init()
{
	const manager = option.get('manager');
	const managerArray = option.get('managerArray');

	let managerProcess = null;

	spinner.start(wordingArray.fetch_dependency + ' ' + manager.toUpperCase());
	readFile()
		.then(packageArray =>
		{
			writeFile(prepare(packageArray))
				.then(() =>
				{
					if (manager in managerArray)
					{
						managerProcess = spawn(manager, managerArray[manager]);
						managerProcess.stdout.on('data', data => spinner.info(manager.toUpperCase() + wordingArray.colon + ' ' + data.toString().trim()));
						managerProcess.on('close', code =>
						{
							readFile().then(packageArray => writeFile(restore(packageArray)));
							code === 0 ? spinner.succeed() : spinner.fail();
						});
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
 * @param injector object
 *
 * @return object
 */

function construct(injector)
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

	if (injector.option && injector.option)
	{
		spinner = injector.spinner;
		option = injector.option;
	}
	return exports;
}

module.exports = construct;
