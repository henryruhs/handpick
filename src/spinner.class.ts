import { EOL } from 'os';
import { Option } from './option.class.js';
import { Cursor, Symbol } from './spinner.enum.js';

export class Spinner
{
	protected stream : NodeJS.WriteStream = process.stdout;
	protected interval : NodeJS.Timer;
	protected message : string;
	protected spinnerTime : number = this.option.get('spinnerTime') as number;
	protected spinnerArray : string[] = this.option.get('spinnerArray') as string[];

	constructor(protected option : Option)
	{
	}

	start(message ?: string) : this
	{
		this.setMessage(message);
		if (this.isInteractive() && this.hasUnicode())
		{
			let index : number = 0;

			this.interval = setInterval(() =>
			{
				if (index === this.spinnerArray.length)
				{
					index = 0;
				}
				this.stream.write(Cursor.HIDE);
				this.stream.clearLine(0);
				this.stream.cursorTo(0);
				this.stream.write(this.spinnerArray[index++]);
				if (this.message)
				{
					this.stream.write(' ' + this.message);
				}
			}, this.spinnerTime);
		}
		else if (this.message)
		{
			this.stream.write(this.message + EOL);
		}
		return this;
	}

	setMessage(message ?: string) : this
	{
		if (message)
		{
			this.message = message;
		}
		return this;
	}

	success(message ?: string) : this
	{
		this.stop(message, Symbol.TICK);
		return this;
	}

	error(message ?: string) : this
	{
		this.stop(message, Symbol.CROSS);
		return this;
	}

	stop(message ?: string, symbol ?: string) : this
	{
		if (this.isInteractive() && this.hasUnicode())
		{
			this.stream.clearLine(0);
			this.stream.cursorTo(0);
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
				this.stream.write(this.message + EOL);
			}
			clearInterval(this.interval);
			this.stream.write(Cursor.SHOW);
		}
		if (message)
		{
			this.stream.write(message + EOL);
		}
		return this;
	}

	protected isInteractive() : boolean
	{
		return this.stream.isTTY;
	}

	protected hasUnicode() : boolean
	{
		return [ 'darwin', 'linux' ].includes(process.platform);
	}
}
