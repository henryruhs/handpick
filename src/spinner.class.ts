import { EOL } from 'os';
import { cursorTo, clearLine } from 'readline';
import { OptionClass } from './option.class.js';
import { Cursor, Symbol } from './spinner.enum.js';

export class SpinnerClass
{
	protected stream : NodeJS.WriteStream = process.stdout;
	protected interval : NodeJS.Timer;
	protected message : string;
	protected spinnerTime : number = this.option.get('spinnerTime') as number;
	protected spinnerArray : string[] = this.option.get('spinnerArray') as string[];

	constructor(protected option : OptionClass)
	{
	}

	start(message ?: string) : this
	{
		let index : number = 0;

		this.setMessage(message);
		this.interval = setInterval(() =>
		{
			if (index === this.spinnerArray.length)
			{
				index = 0;
			}
			this.stream.write(Cursor.HIDE);
			clearLine(this.stream, 0);
			cursorTo(this.stream, 0);
			this.stream.write(this.spinnerArray[index++]);
			if (this.message)
			{
				this.stream.write(' ' + this.message);
			}
		}, this.spinnerTime);
		return this;
	}

	setMessage(message : string) : this
	{
		this.message = message;
		return this;
	}

	success(message ?: string) : this
	{
		this.hasUnicodeSupport() ? this.stop(message, Symbol.TICK) : this.stop(message);
		return this;
	}

	error(message ?: string) : this
	{
		this.hasUnicodeSupport() ? this.stop(message, Symbol.CROSS) : this.stop(message);
		return this;
	}

	stop(message ?: string, symbol ?: string) : this
	{
		clearLine(this.stream, 0);
		cursorTo(this.stream, 0);
		if (symbol)
		{
			this.stream.write(symbol);
		}
		if (this.message)
		{
			if (symbol)
			{
				this.stream.write(' ');
			}
			this.stream.write(this.message);
		}
		if (message)
		{
			this.stream.write(EOL + message);
		}
		this.stream.write(EOL);
		this.stream.write(Cursor.SHOW);
		clearInterval(this.interval);
		return this;
	}

	protected hasUnicodeSupport() : boolean
	{
		return [ 'darwin', 'linux' ].includes(process.platform);
	}
}
