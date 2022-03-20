import { program } from 'commander';
import { OptionClass } from './option.class.js';
import { SpinnerClass } from './spinner.class.js';
import { HelperClass } from './helper.class.js';
import { Package, Wording } from './core.interface.js';
import { StatisticClass } from './statistic.class';
// import { ChildProcess } from 'child_process';

export class CoreClass
{
	// managerProcess : ChildProcess;
	packageObject : Package = this.helper.readJsonSync(this.helper.resolvePath('../package.json')) as Package;
	wordingObject : Wording = this.helper.readJsonSync(this.helper.resolvePath('./assets/wording.json')) as Wording;

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
		// const { manager, managerObject } = this.option.getAll();

		this.statistic.start();
		this.spinner.start(this.startWording());

		setTimeout(() => this.spinner.setMessage('Wait'), 1000);
		setTimeout(() =>
		{
			this.statistic.stop();
			this.spinner.success(this.endWording(this.statistic.getTime(), this.statistic.getPackage()));
		}, 2000);
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
}
