import { Subscription, interval, take, map, repeat } from 'rxjs';
import { EOL } from 'os';
import { OptionClass } from './option.class.js';
import { Cursor } from './spinner.enum.js';

export class SpinnerClass
{
	protected stream : NodeJS.WriteStream = process.stdout;
	protected interval : Subscription;
	protected spinnerPeriod : number = this.option.get('spinnerPeriod') as number;
	protected spinnerArray : string[] = this.option.get('spinnerArray') as string[];

	constructor(protected option : OptionClass)
	{
	}

	start(message ?: string) : void
	{
		this.interval = interval(this.spinnerPeriod)
			.pipe(
				take(this.spinnerArray.length),
				map(index => this.spinnerArray[index]),
				repeat()
			)
			.subscribe(spinnerFrame =>
			{
				this.stream.write(Cursor.HIDE);
				this.stream.write(spinnerFrame);
				if (message)
				{
					this.stream.write(' ' + message);
				}
				this.stream.cursorTo(0);
			});
	}

	stop(message ?: string) : void
	{
		this.stream.clearLine(0);
		if (message)
		{
			this.stream.write(message + EOL);
		}
		this.stream.write(Cursor.SHOW);
		this.interval.unsubscribe();
	}
}
