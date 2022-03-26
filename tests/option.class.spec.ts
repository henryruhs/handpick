import { expect } from 'chai';
import { OptionClass, HelperClass } from '../src';

describe('option', () =>
{
	let option : OptionClass;

	beforeEach(() =>
	{
		option = new OptionClass(new HelperClass());
	});

	it('init', () =>
	{
		expect(option.get('config')).to.equal('.handpick');
		expect(option.get('ignorePrefix')).to.equal('__');
		expect(option.get('manager')).to.equal('npm');
		option.init(
		{
			config: 'tests/provider/.handpick',
			ignorePrefix: '____'
		});
		expect(option.get('config')).to.equal('tests/provider/.handpick');
		expect(option.get('ignorePrefix')).to.equal('____');
		expect(option.get('manager')).to.equal('yarn');
		expect(option.get('packageFile')).to.equal('package.json');
		expect(option.get('packageDirectory')).to.equal('node_modules');
	});

	it('get and set', () =>
	{
		expect(option.get('manager')).to.equal('npm');
		option.set('manager', 'yarn');
		expect(option.get('manager')).to.equal('yarn');
	});

	it('clear', () =>
	{
		option.clear();
		expect(option.get('config')).to.be.null;
	});
});
