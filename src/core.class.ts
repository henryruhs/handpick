import { ChildProcess, spawn } from 'child_process';
import { program, Option as CommanderOption } from 'commander';
import { Helper } from './helper.class.js';
import { Option } from './option.class.js';
import { Packager } from './packager.class.js';
import { Spinner } from './spinner.class.js';
import { Statistic } from './statistic.class.js';
import { Metadata, Wording } from './core.interface.js';
import { Package } from './packager.interface';
import { Options } from './option.interface';

export class Core
{
	protected metadataObject : Metadata = this.helper.readJsonFromAbsolutePath('./assets/metadata.json') as Metadata;
	protected wordingObject : Wording = this.helper.readJsonFromAbsolutePath('./assets/wording.json') as Wording;
	protected managerProcess : ChildProcess;
	protected packageContent : string;

	constructor(
		protected helper : Helper,
		protected option : Option,
		protected packager : Packager,
		protected spinner : Spinner,
		protected statistic : Statistic
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
			.then((packageObject : Package) => this.packager.process(packageObject))
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
		const { managerObject, targetArray, filterArray, rangeArray } : Options = this.option.getAll();
		const programTargetArray : string[] = [];
		const programFilterArray : string[] = [];

		program
			.argument('[path]')
			.option('-c, --config <config>')
			.option('-t, --target <target>', '', target => programTargetArray.push(target))
			.option('-f, --filter <target>', '', filter => programFilterArray.push(filter))
			.addOption(new CommanderOption('-m, --manager <manager>').choices(Object.keys(managerObject)))
			.addOption(new CommanderOption('-r, --range <range>').choices(rangeArray))
			.version(this.metadataObject.name + ' ' + this.metadataObject.version, '-v, --version')
			.action(path =>
			{
				this.option.init(
				{
					path,
					config: program.getOptionValue('config'),
					targetArray: programTargetArray.length ? programTargetArray : targetArray,
					filterArray: programFilterArray.length ? programFilterArray : filterArray,
					manager: program.getOptionValue('manager'),
					range: program.getOptionValue('range')
				});
				this.init();
			})
			.parse(process.argv);
	}

	startWording() : string
	{
		const { manager, targetArray, filterArray, range } : Options = this.option.getAll();
		const wordingArray : string[] =
		[
			this.wordingObject.picking,
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
		const { manager, managerObject, path } : Options = this.option.getAll();

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
