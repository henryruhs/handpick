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
		expect(option.get('path')).to.equal('.');
		expect(option.get('config')).to.equal('.handpickrc');
		expect(option.get('manager')).to.equal('npm');
		option.init(
		{
			path: 'tests/provider/08',
			config: 'tests/provider/.handpickrc'
		});
		expect(option.get('path')).to.equal('tests/provider/08');
		expect(option.get('config')).to.equal('tests/provider/.handpickrc');
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
