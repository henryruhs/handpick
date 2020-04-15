const expect = require('chai').expect;
const option = require('utility-redaxmedia').option(__dirname + '/../option.json');
const handpick = require('../');
const core = handpick.core;
const CORE = new core(
{
	option
});

describe('core', () =>
{
	it('read object from file', done =>
	{
		option.init(
		{
			path: 'tests/provider/package.json'
		});
		CORE.readObjectFromFile()
			.then(packageObject =>
			{
				expect(packageObject).to.have.property('name');
				expect(packageObject).to.have.property('version');
				expect(packageObject).to.have.property('dependencies');
				expect(packageObject).to.have.property('devDependencies');
				expect(packageObject).to.have.property('lintDependencies');
				expect(packageObject).to.have.property('testDependencies');
				done();
			})
			.catch(() => done('error'));
	});

	it('write object to file', done =>
	{
		option.init(
		{
			path: 'tests/provider/package_write.json'
		});
		CORE.writeObjectToFile(
			{
				name: 'test-write'
			})
			.then(() =>
			{
				CORE.readObjectFromFile()
					.then(packageObject =>
					{
						expect(packageObject).to.have.property('name');
						done();
					})
					.catch(() => done('error'));
			})
			.catch(() => done('error'));
	});

	it('prepare prod and dev', done =>
	{
		option.init(
		{
			path: 'tests/provider/package.json'
		});
		CORE.readObjectFromFile()
			.then(packageObject =>
			{
				option.set('path', 'tests/provider/package_prepare_prod_and_dev.json');
				CORE.readObjectFromFile()
					.then(expectObject =>
					{
						expect(CORE.prepare(packageObject)).to.deep.equal(expectObject);
						done();
					})
					.catch(() => done('error'));
			})
			.catch(() => done('error'));
	});

	it('prepare lint and test', done =>
	{
		option.init(
		{
			path: 'tests/provider/package.json',
			targetArray:
			[
				'lintDependencies',
				'testDependencies'
			]
		});
		CORE.readObjectFromFile()
			.then(packageObject =>
			{
				option.set('path', 'tests/provider/package_prepare_lint_and_test.json');
				CORE.readObjectFromFile()
					.then(expectObject =>
					{
						expect(CORE.prepare(packageObject)).to.deep.equal(expectObject);
						done();
					})
					.catch(() => done('error'));
			})
			.catch(() => done('error'));
	});

	it('prepare dev without lint', done =>
	{
		option.init(
		{
			path: 'tests/provider/package.json',
			targetArray:
			[
				'devDependencies'
			],
			filterArray:
			[
				'lintDependencies'
			]
		});
		CORE.readObjectFromFile()
			.then(packageObject =>
			{
				option.set('path', 'tests/provider/package_prepare_dev_without_lint.json');
				CORE.readObjectFromFile()
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
