import * as fs from 'fs';
import { Helper } from './helper';

export class Option
{
	protected optionObject : object = this.helper.readJsonSync(this.helper.resolvePath('./assets/option.json'));

	constructor(protected helper : Helper)
	{
	}

	init(initObject : Record<string, number | string | string[]>) : void
	{
		if (fs.existsSync(initObject.config as fs.PathLike))
		{
			this.optionObject =
			{
				...this.optionObject,
				...this.helper.readJsonSync(initObject.config as fs.PathLike),
				...this.helper.tidy(initObject)
			};
		}
	}

	get(name : string) : number | string | string[]
	{
		return this.optionObject[name] || null;
	}

	set(name : string, value : number | string | string[]) : void
	{
		this.optionObject[name] = value;
	}

	clear() : void
	{
		this.optionObject = {};
	}
}
