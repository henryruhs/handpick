import { EOL } from 'os';
import { OptionClass } from './option.class.js';
import { Cursor } from './spinner.enum.js';

export class SpinnerClass
{
	protected stream : NodeJS.WriteStream = process.stdout;
	protected interval : NodeJS.Timer;
	protected spinnerPeriod : number = this.option.get('spinnerPeriod') as number;
	protected spinnerArray : string[] = this.option.get('spinnerArray') as string[];

	constructor(protected option : OptionClass)
	{
	}

	start(message ?: string) : void
	{
		let index : number = 0;

		this.interval = setInterval(() =>
		{
			if (index === this.spinnerArray.length)
			{
				index = 0;
			}
			this.stream.write(Cursor.HIDE);
			this.stream.write(this.spinnerArray[index++]);
			if (message)
			{
				this.stream.write(' ' + message);
			}
			this.stream.cursorTo(0);
		}, this.spinnerPeriod);
	}

	stop(message ?: string) : void
	{
		this.stream.clearLine(0);
		if (message)
		{
			this.stream.write(message + EOL);
		}
		this.stream.write(Cursor.SHOW);
		clearInterval(this.interval);
	}
}
