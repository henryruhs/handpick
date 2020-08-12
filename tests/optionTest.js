const expect = require('chai').expect;
const ncss = require('../');
const option = ncss.option;

describe('option', () =>
{
	it('init with config', () =>
	{
		option.initWithConfig(
		{
			config: 'tests/provider/option/.handpick',
			ignorePrefix: "____"
		});
		expect(option.get('config')).to.equal('tests/provider/option/.handpick');
		expect(option.get('ignorePrefix')).to.equal('____');
		expect(option.get('manager')).to.equal('yarn');
		expect(option.get('file')).to.equal('package.json');
	});
});
