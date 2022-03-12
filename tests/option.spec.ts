import { expect } from 'chai';
import { Option, Helper } from '../src';

describe('option', () =>
{
	let option : Option;

	beforeEach(() =>
	{
		option = new Option(new Helper());
	});

	it('init', () =>
	{
		expect(option.get('config')).to.equal('.handpick');
		expect(option.get('ignorePrefix')).to.equal('__');
		expect(option.get('manager')).to.equal('npm');
		option.init(
		{
			config: 'tests/provider/option/.handpick',
			ignorePrefix: '____'
		});
		expect(option.get('config')).to.equal('tests/provider/option/.handpick');
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
