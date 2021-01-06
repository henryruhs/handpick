const expect = require('chai').expect;
const exec = require('child_process').exec;
const helper = require('utility-redaxmedia').helper;
const handpick = require('../');
const core = handpick.core;
const option = handpick.option;
const CORE = new core(
{
	option
});

describe('core', () =>
{
	beforeEach(() =>
	{
		const initObject = helper.module.load(__dirname + '/../option.json');

		option.initWithConfig(initObject);
	});

	it('run main command', done =>
	{
		exec('bin/handpick', error =>
		{
			expect(error).to.be.null;
			done();
		});
	})
	.timeout(10000);

	it('run help command', done =>
	{
		exec('bin/handpick --help', (error, stdout) =>
		{
			expect(stdout).to.match(/handpick/);
			done();
		});
	});

	it('run version command', done =>
	{
		exec('bin/handpick --version', (error, stdout) =>
		{
			expect(stdout).to.match(/handpick/);
			done();
		});
	});

	it('read object from package file', done =>
	{
		option.initWithConfig(
		{
			path: 'tests/provider/core'
		});
		CORE.readObjectFromPackageFile()
			.then(packageObject =>
			{
				expect(packageObject).to.have.property('name');
				expect(packageObject).to.have.property('version');
				expect(packageObject).to.have.property('dependencies');
				expect(packageObject).to.have.property('devDependencies');
				expect(packageObject).to.have.property('lintDependencies');
				expect(packageObject).to.have.property('testDependencies');
				expect(packageObject).to.have.property('dirtyDependencies');
				done();
			})
			.catch(() => done('error'));
	});

	it('write object to package file', done =>
	{
		option.initWithConfig(
		{
			path: 'tests/provider/core',
			packageFile: 'package_write.json'
		});
		CORE.writeObjectToPackageFile(
			{
				name: 'test-write'
			})
			.then(() =>
			{
				CORE.readObjectFromPackageFile()
					.then(packageObject =>
					{
						expect(packageObject).to.have.property('name');
						done();
					})
					.catch(() => done('error'));
			})
			.catch(() => done('error'));
	});

	it('count package directory', () =>
	{
		expect(CORE.countPackageDirectory()).to.be.above(10);
		option.initWithConfig(
		{
			packageDirectory: 'invalid'
		});
		expect(CORE.countPackageDirectory()).to.be.equal(0);
	});

	it('prepare prod and dev', done =>
	{
		option.initWithConfig(
		{
			path: 'tests/provider/core'
		});
		CORE.readObjectFromPackageFile()
			.then(packageObject =>
			{
				option.set('packageFile', 'package_prepare_prod_and_dev.json');
				CORE.readObjectFromPackageFile()
					.then(expectObject =>
					{
						expect(CORE.prepare(packageObject)).to.deep.equal(expectObject);
						done();
					})
					.catch(() => done('error'));
			})
			.catch(() => done('error'));
	});

	option.get('rangeArray').map(range =>
	{
		it('prepare dirty to ' + range, done =>
		{
			option.initWithConfig(
			{
				path: 'tests/provider/core',
				range,
				targetArray:
				[
					'dirtyDependencies'
				]
			});
			CORE.readObjectFromPackageFile()
				.then(packageObject =>
				{
					option.set('packageFile', 'package_prepare_dirty_to_' + range + '.json');
					CORE.readObjectFromPackageFile()
						.then(expectObject =>
						{
							expect(CORE.prepare(packageObject)).to.deep.equal(expectObject);
							done();
						})
						.catch(() => done('error'));
				})
				.catch(() => done('error'));
		});
	});

	it('prepare lint and test', done =>
	{
		option.initWithConfig(
		{
			path: 'tests/provider/core',
			targetArray:
			[
				'lintDependencies',
				'testDependencies'
			]
		});
		CORE.readObjectFromPackageFile()
			.then(packageObject =>
			{
				option.set('packageFile', 'package_prepare_lint_and_test.json');
				CORE.readObjectFromPackageFile()
					.then(expectObject =>
					{
						expect(CORE.prepare(packageObject)).to.deep.equal(expectObject);
						done();
					})
					.catch(() => done('error'));
			})
			.catch(() => done('error'));
	});

	it('prepare dev without assert and lint', done =>
	{
		option.initWithConfig(
		{
			path: 'tests/provider/core',
			targetArray:
			[
				'devDependencies'
			],
			filterArray:
			[
				'assertDependencies',
				'lintDependencies'
			]
		});
		CORE.readObjectFromPackageFile()
			.then(packageObject =>
			{
				option.set('packageFile', 'package_prepare_dev_without_assert_and_lint.json');
				CORE.readObjectFromPackageFile()
					.then(expectObject =>
					{
						expect(CORE.prepare(packageObject)).to.deep.equal(expectObject);
						done();
					})
					.catch(() => done('error'));
			})
			.catch(() => done('error'));
	});

	it('start wording', () =>
	{
		option.initWithConfig(
		{
			path: 'tests/provider/core'
		});
		expect(CORE.startWording()).to.equal('Hand picking DIRTY dependencies and devDependencies via NPM');
		option.set('manager', 'yarn');
		option.set('range', 'exact');
		option.set('targetArray',
		[
			'devDependencies'
		]);
		option.set('filterArray',
		[
			'lintDependencies'
		]);
		expect(CORE.startWording()).to.equal('Hand picking EXACT devDependencies without lintDependencies via YARN');
	});

	it('end wording', () =>
	{
		option.initWithConfig(
		{
			path: 'tests/provider/core'
		});
		expect(CORE.endWording(0, 1000, 0, 1)).to.equal('Done 1 package in 1.00 second');
		expect(CORE.endWording(0, 2000, 0, 2)).to.equal('Done 2 packages in 2.00 seconds');
	});
});
