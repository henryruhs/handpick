import { ChildProcess, spawn } from 'child_process';
import { program } from 'commander';
import { HelperClass } from './helper.class.js';
import { OptionClass } from './option.class.js';
import { PackagerClass } from './packager.class.js';
import { SpinnerClass } from './spinner.class.js';
import { StatisticClass } from './statistic.class.js';
import { Wording } from './core.interface.js';
import { Package } from './packager.interface';

export class CoreClass
{
	packageObject : Package = this.helper.readJsonSync(this.helper.resolveAbsolutePath('../package.json')) as Package;
	wordingObject : Wording = this.helper.readJsonSync(this.helper.resolveAbsolutePath('./assets/wording.json')) as Wording;
	managerProcess : ChildProcess;
	packageContent : string;

	constructor(
		protected helper : HelperClass,
		protected option : OptionClass,
		protected packager : PackagerClass,
		protected spinner : SpinnerClass,
		protected statistic : StatisticClass
	)
	{
	}

	init() : void
	{
		this.statistic.start();
		this.spinner.start(this.startWording());
		this.packager
			.readFileAsync()
			.then(content => this.packageContent = content.toString())
			.then(content => this.helper.parseJson(content.toString()))
			.then((packageObject : Package) => this.packager.prepare(packageObject))
			.then((packageObject : Package) => this.helper.stringifyObject(packageObject))
			.then((packageContent : string) =>
			{
				this.packager
					.writeFileAsync(packageContent)
					.then(() => this.handleManager())
					.catch((error : Error) => this.spinner.error(error.message));
			})
			.catch((error : Error) => this.spinner.error(error.message));
	}

	cli(process : NodeJS.Process) : void
	{
		const { managerObject, targetArray, filterArray, rangeArray } = this.option.getAll();
		const programTargetArray : string[] = [];
		const programFilterArray : string[] = [];

		program
			.version(this.packageObject.name + ' ' + this.packageObject.version)
			.option('-C, --config <config>')
			.option('-T, --target <target>', '', target => programTargetArray.push(target))
			.option('-F, --filter <target>', '', filter => programFilterArray.push(filter))
			.option('-M, --manager <manager>', Object.keys(managerObject).join(' | '))
			.option('-R, --range <range>', rangeArray.join(' | '))
			.option('-P, --path <path>')
			.parse(process.argv);

		/* init as needed */

		this.option.init(
		{
			config: program.getOptionValue('config'),
			targetArray: programTargetArray.length ? programTargetArray : targetArray,
			filterArray: programFilterArray.length ? programFilterArray : filterArray,
			manager: program.getOptionValue('manager'),
			range: program.getOptionValue('range'),
			path: program.getOptionValue('path')
		});
		this.init();
	}

	startWording() : string
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

	endWording(resultTime : number, resultPackage : number) : string
	{
		const wordingArray : string[] =
		[
			this.wordingObject.done,
			resultPackage.toString(),
			resultPackage > 1 ? this.wordingObject.packages : this.wordingObject.package,
			this.wordingObject.in,
			(resultTime / 1000).toFixed(2),
			(resultTime / 1000) > 1 ? this.wordingObject.seconds : this.wordingObject.second
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
			this.packager
				.writeFileAsync(this.packageContent)
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
}
