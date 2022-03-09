import * as fs from 'fs';

export class Option
{
	protected optionObject : Record<string, number | string | string[]> = this.readJsonSync('./src/assets/option.json');

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
		if (fs.existsSync(this.get('config') as fs.PathLike))
		{
			this.init(
			{
				...this.readJsonSync(this.get('config') as string),
				...this.tidy(initObject)
			});
		}
		if (fs.existsSync(initObject.config as fs.PathLike))
		{
			this.init(
			{
				...this.readJsonSync(initObject.config as string),
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

	protected tidy(dirtyObject : object) : object
	{
		return JSON.parse(JSON.stringify(dirtyObject));
	}

	protected readJsonSync(path : string) : Record<string, number | string | string[]>
	{
		try
		{
			return JSON.parse(fs.readFileSync(path, 'utf-8'));
		}
		catch
		{
			return {};
		}
	}
}
