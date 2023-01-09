import { promisify } from 'util';
import { PathLike, readFile, writeFile } from 'fs';
import semver, { SemVer } from 'semver';
import { Option } from './option.class.js';
import { Dependencies, Package } from './packager.interface';
import { Options } from './option.interface';

export class Packager
{
	constructor(protected option : Option)
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

	process(packageObject : Package) : Partial<Package>
	{
		const resultObject : Partial<Package> = {};

		this.processTarget(resultObject, packageObject);
		if (resultObject.dependencies)
		{
			this.processFilter(resultObject);
			this.processReference(resultObject, packageObject);
			this.processRange(resultObject);
		}
		return resultObject;
	}

	protected processTarget(resultObject : Partial<Package>, packageObject : Package) : void
	{
		const { targetArray, ignoreArray, ignorePrefix } : Options = this.option.getAll();

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
	}

	protected processFilter(resultObject : Partial<Package>) : void
	{
		const { filterArray } : Options = this.option.getAll();
		const nameArray : string[] = filterArray.flatMap(filterValue => Object.keys(resultObject[filterValue]));
		const filterObject : Dependencies = {};

		Object.keys(resultObject.dependencies)
			.filter(resultValue => !nameArray.includes(resultValue))
			.map(resultValue => filterObject[resultValue] = resultObject.dependencies[resultValue]);
		resultObject.dependencies = filterObject;
	}

	protected processReference(resultObject : Partial<Package>, packageObject : Package) : void
	{
		const { referencePrefix } : Options = this.option.getAll();

		Object.keys(resultObject.dependencies)
			.filter(resultValue => resultObject.dependencies[resultValue].startsWith(referencePrefix))
			.map(resultValue =>
			{
				const reference : keyof Package = resultObject.dependencies[resultValue].slice(1) as keyof Package;

				resultObject.dependencies[resultValue] = packageObject[reference][resultValue];
			});
	}

	protected processRange(resultObject : Partial<Package>) : void
	{
		Object.keys(resultObject.dependencies).map(resultValue =>
		{
			const { range } : Options = this.option.getAll();
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
	}

	protected resolveFilePath() : PathLike
	{
		const { path, packageFile } : { path : string, packageFile : string } = this.option.getAll();

		return path + '/' + packageFile;
	}
}
