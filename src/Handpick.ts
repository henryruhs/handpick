import { Spinner } from './Spinner';
import { Option } from './Option';

export class Handpick
{
	constructor (protected spinner : Spinner, protected option : Option)
	{
	}

	init() : void
	{
		this.spinner.getInstance().start('@start');
	}

	prepare() : void
	{
	}
}
