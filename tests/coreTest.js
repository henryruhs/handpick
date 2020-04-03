const expect = require('chai').expect;
const handpick = require('../');
const core = handpick.core;
const option = handpick.option;
const CORE = new core(
{
	option
});

describe('core', () =>
{
	it('read file', done =>
	{
		option.init(
		{
			package: 'tests/provider/package.json'
		});
		CORE.readFile()
			.then(packageArray =>
			{
				expect(packageArray).to.deep.equal(
				{
					name: 'test-project',
					version: '1.0.0',
					dependencies:
					{
						'test-prod': '1.0.0'
					},
					devDependencies:
					{
						'test-dev': '1.0.0'
					},
					lintDependencies:
					{
						'test-lint': '1.0.0'
					},
					buildDependencies:
					{
						'test-build': '1.0.0'
					}
				});
				done();
			})
			.catch(() => done('error'));
	});

	it('write file', done =>
	{
		option.init(
		{
			package: 'tests/provider/package_write.json'
		});
		CORE.writeFile(
			{
				name: 'test-write'
			})
			.then(() => done())
			.catch(() => done('error'));
	});

	it('prepare', done =>
	{
		option.init(
		{
			package: 'tests/provider/package.json',
			targetArray:
			[
				'lintDependencies',
				'buildDependencies'
			]
		});
		CORE.readFile()
			.then(packageArray =>
			{
				expect(CORE.prepare(packageArray)).to.deep.equal(
				{
					name: 'test-project',
					version: '1.0.0',
					__dependencies:
					{
						'test-prod': '1.0.0'
					},
					__devDependencies:
					{
						'test-dev': '1.0.0'
					},
					lintDependencies:
					{
						'test-lint': '1.0.0'
					},
					buildDependencies:
					{
						'test-build': '1.0.0'
					},
					dependencies:
					{
						'test-lint': '1.0.0',
						'test-build': '1.0.0'
					}
				});
				done();
			})
			.catch(() => done('error'));
	});

	it('restore', done =>
	{
		option.init(
		{
			package: 'tests/provider/package_prepare.json',
			targetArray:
			[
				'lintDependencies',
				'buildDependencies'
			]
		});
		CORE.readFile()
			.then(packageArray =>
			{
				expect(CORE.restore(packageArray)).to.deep.equal(
				{
					name: 'test-project',
					version: '1.0.0',
					dependencies:
					{
						'test-prod': '1.0.0'
					},
					devDependencies:
					{
						'test-dev': '1.0.0'
					},
					lintDependencies:
					{
						'test-lint': '1.0.0'
					},
					buildDependencies:
					{
						'test-build': '1.0.0'
					}
				});
				done();
			})
			.catch(() => done('error'));
	});
});
