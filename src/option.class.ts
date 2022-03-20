import { existsSync, PathLike } from 'fs';
import { HelperClass } from './helper.class.js';
import { Options } from './option.interface.js';

export class OptionClass
{
	protected options : Options = this.helper.readJsonSync(this.helper.resolvePath('./assets/option.json')) as Options;

	constructor(protected helper : HelperClass)
	{
	}

	init(initObject : Partial<Options>) : void
	{
		if (existsSync(initObject.config as PathLike))
		{
			this.options =
			{
				...this.options,
				...this.helper.readJsonSync(initObject.config as PathLike),
				...this.helper.tidy(initObject)
			};
		}
	}

	get(name : keyof Options) : Options[keyof Options]
	{
		return this.options[name] || null;
	}

	getAll() : Options
	{
		return this.options;
	}

	set(name : string, value : Options[keyof Options]) : void
	{
		this.options[name] = value;
	}

	setAll(options : Options) : void
	{
		this.options = options;
	}

	clear() : void
	{
		this.options = {} as Options;
	}
}
