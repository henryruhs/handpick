import * as fs from 'fs-extra';
import { PathLike } from 'fs';

export class Option
{
	protected optionObject : Record<string, number | string | string[]> = {};

	init(initObject : Record<string, number | string | string[]>) : void
	{
		this.optionObject =
		{
			...this.optionObject,
			...this.tidy(initObject)
		};
	}

	initWithConfig(initObject : Record<string, number | string | string[]>) : void
	{
		if (fs.existsSync(this.get('config') as PathLike))
		{
			this.init(
			{
				...fs.readJsonSync(this.get('config') as string),
				...this.tidy(initObject)
			});
		}
		if (fs.existsSync(initObject.config as PathLike))
		{
			this.init(
			{
				...fs.readJsonSync(initObject.config as string),
				...this.tidy(initObject)
			});
		}
	}

	get(name : string) : number | string | string[]
	{
		return this.optionObject[name];
	}

	set(name : string, value : number | string | string[]) : void
	{
		this.optionObject[name] = value;
	}

	clear() : void
	{
		this.optionObject = {};
	}

	tidy(dirtyObject : object) : object
	{
		return JSON.parse(JSON.stringify(dirtyObject));
	}
}
