import { program } from 'commander';
import * as fs from 'fs-extra';
import { Option } from './Option';

export class Cli
{
	constructor(protected option : Option)
	{
	}

	init(process : NodeJS.Process) : void
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

		this.setOption(targetArray, filterArray);
	}

	protected setOption(targetArray : string[], filterArray : string[]) : void
	{
		this.option.set('config', program.config);
		if (targetArray.length)
		{
			this.option.set('targetArray', targetArray);
		}
		if (filterArray.length)
		{
			this.option.set('filterArray', filterArray);
		}
		this.option.set('manager', program.manager);
		this.option.set('path', program.path);
		this.option.set('range', program.range);
	}
}
