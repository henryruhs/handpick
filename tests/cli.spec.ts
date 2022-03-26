import { expect } from 'chai';
import { exec } from 'child_process';

describe('cli', () =>
{
	it('run help command', done =>
	{
		exec('node --loader ts-node/esm src/cli.ts --help', error =>
		{
			expect(error).to.be.null;
			done();
		});
	});

	it('run version command', done =>
	{
		exec('node --loader ts-node/esm src/cli.ts --version', error =>
		{
			expect(error).to.be.null;
			done();
		});
	});
});
