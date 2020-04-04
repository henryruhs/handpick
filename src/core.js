const fs = require('fs');
const spawn = require('cross-spawn-promise');
const path = require('path');

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
	const resolvePackage = path.resolve(option.get('package'));

	return await fs.promises.readFile(resolvePackage).then(content => JSON.parse(content));
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
	const resolvePackage = path.resolve(option.get('package'));
	const content = JSON.stringify(packageArray, null, option.get('indent'));

	return await fs.promises.writeFile(resolvePackage, content);
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

	readFile()
		.then(packageArray =>
		{
			writeFile(prepare(packageArray)).then(() =>
			{
				if (manager === 'npm')
				{
					spawn('npm',
					[
						'install',
						'--no-package-lock'
					])
					.then(() => readFile().then(packageArray => writeFile(restore(packageArray))))
					.catch(error => new Error(error));
				}
				if (manager === 'yarn')
				{
					spawn('yarn',
					[
						'--no-lockfile'
					])
					.then(() => readFile().then(packageArray => writeFile(restore(packageArray))))
					.catch(error => new Error(error));
				}
			});
		});
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

	if (injector.option)
	{
		option = injector.option;
	}
	return exports;
}

module.exports = construct;
