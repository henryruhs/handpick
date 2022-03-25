import { expect } from 'chai';
import { HelperClass, OptionClass, PackagerClass } from '../src';
import { Package } from '../src/packager.interface';

describe('packager', () =>
{
	let helper : HelperClass;
	let option : OptionClass;
	let packager : PackagerClass;

	beforeEach(() =>
	{
		helper = new HelperClass();
		option = new OptionClass(helper);
		packager = new PackagerClass(option);
	});

	it('read object from package file', done =>
	{
		option.init(
		{
			path: 'tests/provider'
		});
		packager
			.readFileAsync()
			.then(content => helper.parseJson(content.toString()))
			.then((packageObject : Package) =>
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
		option.init(
		{
			path: 'tests/provider',
			packageFile: 'package_write.json'
		});
		packager.writeFileAsync(helper.stringifyObject(
		{
			name: 'test-write'
		}))
		.then(() =>
		{
			packager
				.readFileAsync()
				.then(content => helper.parseJson(content.toString()))
				.then((packageObject : Package) =>
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
			path: 'tests/provider'
		});
		packager
			.readFileAsync()
			.then(content => helper.parseJson(content.toString()))
			.then((packageObject : Package) =>
			{
				option.set('packageFile', 'package_prepare_prod_and_dev.json');
				packager
					.readFileAsync()
					.then(content => helper.parseJson(content.toString()))
					.then((expectObject : Package) =>
					{
						expect(packager.prepare(packageObject)).to.deep.equal(expectObject);
						done();
					})
					.catch(() => done('error'));
			})
			.catch(() => done('error'));
	});
});
