import { program } from 'commander';
import { OptionClass } from './option.class';
import { SpinnerClass } from './spinner.class';
import { HelperClass } from './helper.class';
import { Package } from './core.interface';

export class CoreClass
{
	packageObject : Package = this.helper.readJsonSync(this.helper.resolvePath('../package.json')) as Package;

	constructor (protected option : OptionClass, protected spinner : SpinnerClass, protected helper : HelperClass)
	{
	}

	init() : void
	{
		this.spinner.getInstance().start('@start');
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
			.option('-R, --range <range>', Array(this.option.get('rangeArray')).join(' | '))
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
}
