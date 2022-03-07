import ora, { Ora } from 'ora';

export class Spinner
{
	protected spinner : Ora;

	constructor()
	{
		this.createInstance();
	}

	createInstance() : void
	{
		this.spinner = ora(
		{
			spinner: 'dots',
			interval: 40
		});
	}

	getInstance() : Ora
	{
		return this.spinner;
	}
}
