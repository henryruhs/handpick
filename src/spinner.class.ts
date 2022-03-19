import { EOL } from 'os';
import { OptionClass } from './option.class.js';
import { Cursor, Symbol } from './spinner.enum.js';

export class SpinnerClass
{
	protected stream : NodeJS.WriteStream = process.stdout;
	protected interval : NodeJS.Timer;
	protected message : string;
	protected spinnerPeriod : number = this.option.get('spinnerPeriod') as number;
	protected spinnerArray : string[] = this.option.get('spinnerArray') as string[];

	constructor(protected option : OptionClass)
	{
	}

	start(message ?: string) : void
	{
		let index : number = 0;

		this.message = message;
		this.interval = setInterval(() =>
		{
			if (index === this.spinnerArray.length)
			{
				index = 0;
			}
			this.stream.write(Cursor.HIDE);
			this.stream.write(this.spinnerArray[index++]);
			if (this.message)
			{
				this.stream.write(' ' + this.message);
			}
			this.stream.cursorTo(0);
		}, this.spinnerPeriod);
	}

	success(message ?: string) : void
	{
		this.stream.clearLine(0);
		if (this.hasUnicodeSupport())
		{
			this.stream.write(Symbol.TICK);
		}
		this.stop(message);
	}

	error(message ?: string) : void
	{
		this.stream.clearLine(0);
		if (this.hasUnicodeSupport())
		{
			this.stream.write(Symbol.CROSS);
		}
		this.stop(message);
	}

	stop(message ?: string) : void
	{
		if (this.message)
		{
			if (this.hasUnicodeSupport())
			{
				this.stream.write(' ');
			}
			this.stream.write(this.message);
		}
		if (message)
		{
			this.stream.write(EOL + message + EOL);
		}
		this.stream.write(Cursor.SHOW);
		clearInterval(this.interval);
	}

	protected hasUnicodeSupport() : boolean
	{
		return [ 'darwin', 'linux' ].includes(process.platform);
	}
}
