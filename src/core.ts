import * as fs from 'fs-extra';
import { Option } from './option';
import { Spinner } from './spinner';
import { program } from 'commander';

export class Core
{
	constructor (protected option : Option, protected spinner : Spinner)
	{
	}

	init() : void
	{
		this.spinner.getInstance().start('@start');
	}

	cli(process : NodeJS.Process) : void
	{
		const packageObject : Record<string, string> = fs.readJsonSync('./package.json');
		const targetArray : string[] = [];
		const filterArray : string[] = [];

		program
			.version(packageObject.name + ' ' + packageObject.version)
			.option('-C, --config <config>')
			.option('-T, --target <target>', '', target => targetArray.push(target))
			.option('-F, --filter <target>', '', filter => filterArray.push(filter))
			.option('-M, --manager <manager>', Array(this.option.get('managerArray')).join(' | '))
			.option('-R, --range <range>', Array(this.option.get('rangeArray')).join(' | '))
			.option('-P, --path <path>')
			.parse(process.argv);

		/* init as needed */

		this.option.initWithConfig(
		{
			config: program.getOptionValue('config'),
			targetArray: targetArray.length ? targetArray : this.option.get('targetArray'),
			filterArray: filterArray.length ? filterArray : this.option.get('filterArray'),
			manager: program.getOptionValue('manager'),
			path: program.getOptionValue('path'),
			range: program.getOptionValue('range')
		});
		this.init();
	}
}
