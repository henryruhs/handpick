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
		expect(option.get('manager')).to.equal('npm');
		option.init(
		{
			config: 'tests/provider/.handpick',
			ignorePrefix: '____'
		});
		expect(option.get('config')).to.equal('tests/provider/.handpick');
		expect(option.get('manager')).to.equal('yarn');
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
