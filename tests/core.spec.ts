import { Core, Option, Spinner } from '../src';

describe('Core', () =>
{
	it('create instance', done =>
	{
		new Core(new Option(), new Spinner());
		done();
	});
});
