import { helper } from 'utility-redaxmedia';

export class Option
{
	protected optionObject : Record<string, number | string | string[]> = {};

	init(initObject : Record<string, number | string | string[]>) : void
	{
		this.optionObject =
		{
			...this.optionObject,
			...helper.object.tidy(initObject)
		};
	}

	initWithConfig() : void
	{
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
}
