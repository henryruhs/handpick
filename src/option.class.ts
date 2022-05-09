import { PathLike } from 'fs';
import { Helper } from './helper.class.js';
import { Options } from './option.interface.js';

export class Option
{
	protected options : Options = this.helper.readJsonSync(this.helper.resolveAbsolutePath('./assets/option.json')) as Options;

	constructor(protected helper : Helper)
	{
	}

	init(initObject : Partial<Options>) : void
	{
		this.options =
		{
			...this.options,
			...this.helper.readJsonSync(this.get('config') as PathLike),
			...this.helper.readJsonSync(initObject.config as PathLike),
			...this.helper.tidyObject(initObject)
		};
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
