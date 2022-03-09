import { Core, Option, Spinner, Helper } from '../src';

describe('Core', () =>
{
	it('create instance', done =>
	{
		new Core(new Option(new Helper()), new Spinner(), new Helper());
		done();
	});
});
