import { promisify } from 'util';
import { readFile, writeFile, PathLike } from 'fs';
import semver from 'semver';
import { SemVer } from 'semver';
import { OptionClass } from './option.class.js';
import { Package } from './packager.interface';

export class PackagerClass
{
	constructor (protected option : OptionClass)
	{
	}

	async readFileAsync() : Promise<Buffer>
	{
		const readFileAsync : Function = promisify(readFile);

		return await readFileAsync(this.resolveFilePath());
	}

	async writeFileAsync(content : string) : Promise<void>
	{
		const writeFileAsync : Function = promisify(writeFile);

		return await writeFileAsync(this.resolveFilePath(), content);
	}

	prepare(packageObject : Package) : Partial<Package>
	{
		const { ignoreArray, targetArray, filterArray, range, ignorePrefix, referencePrefix } = this.option.getAll();
		const filterContentArray : string[] = [];
		const filterObject : Record<string, string> = {};
		const resultObject : Partial<Package> = {};

		/* handle target */

		Object.keys(packageObject).map(packageValue =>
		{
			if (ignoreArray.includes(packageValue))
			{
				resultObject[ignorePrefix + packageValue] = packageObject[packageValue];
			}
			else
			{
				resultObject[packageValue] = packageObject[packageValue];
			}
			if (targetArray.includes(packageValue))
			{
				resultObject.dependencies =
				{
					...resultObject.dependencies,
					...packageObject[packageValue]
				};
			}
		});

		/* handle filter */

		filterArray.map(filterValue =>
		{
			Object.keys(resultObject[filterValue]).map(filterContentValue =>
			{
				filterContentArray.push(filterContentValue);
			});
		});
		Object.keys(resultObject.dependencies).map(resultValue =>
		{
			if (!filterContentArray.includes(resultValue))
			{
				filterObject[resultValue] = resultObject.dependencies[resultValue];
			}
		});
		resultObject.dependencies = filterObject;

		/* handle reference */

		Object.keys(resultObject.dependencies).map(resultValue =>
		{
			if (resultObject.dependencies[resultValue].startsWith(referencePrefix))
			{
				const reference : string = resultObject.dependencies[resultValue].slice(1);

				resultObject.dependencies[resultValue] = packageObject[reference][resultValue];
			}
		});

		/* handle range */

		Object.keys(resultObject.dependencies).map(resultValue =>
		{
			const coerceObject : SemVer = semver.coerce(resultObject.dependencies[resultValue]);
			const version : string = coerceObject?.version;

			if (range === 'exact' && version)
			{
				resultObject.dependencies[resultValue] = version;
			}
			if (range === 'patch' && version)
			{
				resultObject.dependencies[resultValue] = '~' + version;
			}
			if (range === 'minor' && version)
			{
				resultObject.dependencies[resultValue] = '^' + version;
			}
		});
		return resultObject;
	}

	protected resolveFilePath() : PathLike
	{
		const { path, packageFile } = this.option.getAll();

		return path + '/' + packageFile;
	}
}
