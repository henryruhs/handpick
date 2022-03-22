import { readFile, writeFile, PathLike } from 'fs';
import { ChildProcess, spawn } from 'child_process';
import { promisify } from 'util';
import * as semver from 'semver';
import { SemVer } from 'semver';
import { program } from 'commander';
import { HelperClass } from './helper.class.js';
import { OptionClass } from './option.class.js';
import { SpinnerClass } from './spinner.class.js';
import { StatisticClass } from './statistic.class';
import { Package, Wording } from './core.interface.js';

export class CoreClass
{
	packageObject : Package = this.helper.readJsonSync(this.helper.resolveAbsolutePath('../package.json')) as Package;
	wordingObject : Wording = this.helper.readJsonSync(this.helper.resolveAbsolutePath('./assets/wording.json')) as Wording;
	managerProcess : ChildProcess;
	packageContent : string;

	constructor (
		protected helper : HelperClass,
		protected option : OptionClass,
		protected spinner : SpinnerClass,
		protected statistic : StatisticClass
	)
	{
	}

	init() : void
	{
		this.statistic.start();
		this.spinner.start(this.startWording());
		this.readPackageFile()
			.then(content => this.packageContent = content)
			.then(content => this.helper.parseJson(content))
			.then((packageObject : Package) =>
			{
				this.writePackageFile(this.helper.stringifyObject(this.preparePackage(packageObject)))
					.then(() => this.handleManager())
					.catch((error : Error) => this.spinner.error(error.message));
			})
			.catch((error : Error) => this.spinner.error(error.message));
	}

	cli(process : NodeJS.Process) : void
	{
		const targetArray : string[] = [];
		const filterArray : string[] = [];

		program
			.version(this.packageObject.name + ' ' + this.packageObject.version)
			.option('-C, --config <config>')
			.option('-T, --target <target>', '', target => targetArray.push(target))
			.option('-F, --filter <target>', '', filter => filterArray.push(filter))
			.option('-M, --manager <manager>', Object.keys(this.option.get('managerObject')).join(' | '))
			.option('-R, --range <range>', (this.option.get('rangeArray') as string[]).join(' | '))
			.option('-P, --path <path>')
			.parse(process.argv);

		/* init as needed */

		this.option.init(
		{
			config: program.getOptionValue('config'),
			targetArray: targetArray.length ? targetArray : this.option.get('targetArray') as string[],
			filterArray: filterArray.length ? filterArray : this.option.get('filterArray') as string[],
			manager: program.getOptionValue('manager'),
			path: program.getOptionValue('path'),
			range: program.getOptionValue('range')
		});
		this.init();
	}

	protected startWording() : string
	{
		const { manager, targetArray, filterArray, range } = this.option.getAll();
		const wordingArray : string[] =
		[
			this.wordingObject.handpick,
			range.toUpperCase(),
			targetArray.join(' ' + this.wordingObject.and + ' ')
		];

		if (filterArray.length)
		{
			wordingArray.push(this.wordingObject.without, filterArray.join(' ' + this.wordingObject.and + ' '));
		}
		wordingArray.push(this.wordingObject.via, manager.toUpperCase());
		return wordingArray.join(' ');
	}

	protected endWording(resultTime : number, resultPackage : number) : string
	{
		const wordingArray : string[] =
		[
			this.wordingObject.done,
			resultPackage.toString(),
			resultPackage > 1 ? this.wordingObject.packages : this.wordingObject.package,
			this.wordingObject.in,
			resultTime.toFixed(2),
			resultTime > 1 ? this.wordingObject.seconds : this.wordingObject.second
		];

		return wordingArray.join(' ');
	}

	protected handleManager() : void
	{
		const { manager, managerObject, path } = this.option.getAll();

		this.managerProcess = spawn(manager, managerObject[manager],
		{
			cwd: path,
			stdio: 'ignore',
			shell: true
		});
		this.managerProcess.on('close', (code : number) =>
		{
			this.writePackageFile(this.packageContent)
				.then(() => this.statistic.stop())
				.then(() => this.endWording(this.statistic.calcResultTime(), this.statistic.calcResultPackage()))
				.then(wording => code === 1 ? this.spinner.error(wording) : this.spinner.success(wording))
				.catch((error : Error) => this.spinner.error(error.message));
		});
		this.managerProcess.on('error', () => null);
		[
			'SIGHUP',
			'SIGINT',
			'SIGQUIT',
			'SIGTERM',
			'uncaughtException'
		]
		.forEach(eventType =>
		{
			process.on(eventType, () => this.managerProcess.emit('error',
			{
				code: 1
			}));
		});
	}

	protected async readPackageFile() : Promise<string>
	{
		const readFileAsync : Function = promisify(readFile);

		return await readFileAsync(this.resolvePackagePath());
	}

	protected async writePackageFile(content : string) : Promise<void>
	{
		const writeFileAsync : Function = promisify(writeFile);

		return await writeFileAsync(this.resolvePackagePath(), content);
	}

	protected resolvePackagePath() : PathLike
	{
		const { path, packageFile } = this.option.getAll();

		return this.helper.resolveAbsolutePath(path + '/' + packageFile);
	}

	protected preparePackage(packageObject : Package) : Partial<Package>
	{
		const { ignoreArray, targetArray, filterArray, range, ignorePrefix } = this.option.getAll();
		const filterFlatArray : string[] = [];
		const filterObject : Record<string, string> = {};
		const resultObject : Partial<Package> = {};

		/* handle prefix */

		Object.keys(packageObject).map(packageValue =>
		{
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
			Object.keys(resultObject[filterValue]).map(filterFlatValue =>
			{
				filterFlatArray.push(filterFlatValue);
			});
		});
		Object.keys(resultObject.dependencies).map(resultValue =>
		{
			if (!filterFlatArray.includes(resultValue))
			{
				filterObject[resultValue] = resultObject.dependencies[resultValue];
			}
		});
		resultObject.dependencies = filterObject;

		/* handle range */

		Object.keys(resultObject.dependencies).map(resultValue =>
		{
			const coerceObject : SemVer = semver.coerce(resultObject.dependencies[resultValue]);
			const version : string = coerceObject ? coerceObject.version : null;

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
}
