import { expect } from 'chai';
import { HelperClass, OptionClass, PackagerClass } from '../src';

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
			path: 'tests/provider/core'
		});
		packager.readFileAsync()
			.then(content => helper.parseJson(content.toString()))
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
		option.init(
		{
			path: 'tests/provider/core',
			packageFile: 'package_write.json'
		});
		packager.writeFileAsync(helper.stringifyObject(
		{
			name: 'test-write'
		}))
		.then(() =>
		{
			packager.readFileAsync()
				.then(content => helper.parseJson(content.toString()))
				.then(packageObject =>
				{
					expect(packageObject).to.have.property('name');
					done();
				})
				.catch(() => done('error'));
		})
		.catch(() => done('error'));
	});
});
