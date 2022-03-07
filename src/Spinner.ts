import * as ora from 'ora';

export class Spinner
{
	protected spinner : ora.Ora;

	constructor()
	{
		this.spinner = ora(
		{
			spinner: 'dots',
			interval: 40
		});
	}

	getInstance() : ora.Ora
	{
		return this.spinner;
	}
}
