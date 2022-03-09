import { expect } from 'chai';
import { Option } from '../src';

describe('option', () =>
{
	let option : Option;

	beforeEach(() =>
	{
		option = new Option();
	});

	it('init with config', () =>
	{
		option.initWithConfig(
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
});
