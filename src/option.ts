import * as fs from 'fs';
import { Helper } from './helper';

export class Option
{
	protected optionObject : object;

	constructor(protected helper : Helper)
	{
		this.optionObject = this.helper.readJsonSync('./src/assets/option.json');
	}

	init(initObject : Record<string, number | string | string[]>) : void
	{
		if (fs.existsSync(initObject.config as fs.PathLike))
		{
			this.setAll(
			{
				...this.helper.readJsonSync(initObject.config as fs.PathLike),
				...this.helper.tidy(initObject)
			});
		}
	}

	get(name : string) : number | string | string[]
	{
		return this.optionObject[name];
	}

	getAll() : object
	{
		return this.optionObject;
	}

	set(name : string, value : number | string | string[]) : void
	{
		this.optionObject[name] = value;
	}

	setAll(optionObject : Record<string, number | string | string[]>) : void
	{
		this.optionObject =
		{
			...this.optionObject,
			...this.helper.tidy(optionObject)
		};
	}

	clear() : void
	{
		this.optionObject = {};
	}
}
