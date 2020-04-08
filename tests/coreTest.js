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
			.then(packageArray =>
			{
				expect(packageArray).to.have.property('name');
				expect(packageArray).to.have.property('version');
				expect(packageArray).to.have.property('dependencies');
				expect(packageArray).to.have.property('devDependencies');
				expect(packageArray).to.have.property('lintDependencies');
				expect(packageArray).to.have.property('buildDependencies');
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
					.then(packageArray =>
					{
						expect(packageArray).to.have.property('name');
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
			.then(packageArray =>
			{
				option.set('path', 'tests/provider/package_prepare_prod_dev.json');
				CORE.readObjectFromFile()
					.then(equalArray =>
					{
						expect(CORE.prepare(packageArray)).to.deep.equal(equalArray);
						done();
					})
					.catch(() => done('error'));
			})
			.catch(() => done('error'));
	});

	it('prepare lint and build', done =>
	{
		option.init(
		{
			path: 'tests/provider/package.json',
			targetArray:
			[
				'lintDependencies',
				'buildDependencies'
			]
		});
		CORE.readObjectFromFile()
			.then(packageArray =>
			{
				option.set('path', 'tests/provider/package_prepare_lint_build.json');
				CORE.readObjectFromFile()
					.then(equalArray =>
					{
						expect(CORE.prepare(packageArray)).to.deep.equal(equalArray);
						done();
					})
					.catch(() => done('error'));
			})
			.catch(() => done('error'));
	});
});
