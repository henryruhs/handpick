import fs from 'fs';
import { exec } from 'child_process';

import { expect } from 'chai';

describe('cli', () =>
{
	describe('run main command', () =>
	{
		afterEach(() => fs.rmSync('tests/provider/08/node_modules', { recursive: true, force: true }));

		it('picking default', done =>
		{
			exec('node --loader ts-node/esm src/cli.ts tests/provider/08', error =>
			{
				expect(error).to.be.null;
				expect(fs.readdirSync('tests/provider/08/node_modules')).to.include.any.members([ 'commander', 'mocha' ]);
				expect(fs.readdirSync('tests/provider/08/node_modules')).to.not.include.any.members([ 'eslint' ]);
				done();
			});
		})
		.timeout(20000);

		it('picking target', done =>
		{
			exec('node --loader ts-node/esm src/cli.ts tests/provider/08 --target=lintDependencies', error =>
			{
				expect(error).to.be.null;
				expect(fs.readdirSync('tests/provider/08/node_modules')).to.not.include.any.members([ 'commander', 'mocha' ]);
				expect(fs.readdirSync('tests/provider/08/node_modules')).to.include.any.members([ 'eslint' ]);
				done();
			});
		})
		.timeout(20000);
	});

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
