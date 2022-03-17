import { Subscription, interval, take, map, repeat } from 'rxjs';
import { EOL } from 'os';
import { OptionClass } from './option.class.js';
import { Cursor } from './spinner.enum.js';

export class SpinnerClass
{
	protected stream : NodeJS.WriteStream = process.stdout;
	protected interval : Subscription;

	constructor(protected option : OptionClass)
	{
	}

	start(message ?: string) : void
	{
		const spinnerInterval : number = this.option.get('spinnerInterval') as number;
		const spinnerArray : string[] = this.option.get('spinnerArray') as string[];

		this.interval = interval(spinnerInterval)
			.pipe(
				take(spinnerArray.length),
				map(index => spinnerArray[index]),
				repeat()
			)
			.subscribe(frame =>
			{
				this.stream.write(Cursor.HIDE);
				this.stream.write(frame);
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
