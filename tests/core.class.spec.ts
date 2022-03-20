import { expect } from 'chai';
import { CoreClass, HelperClass, OptionClass, SpinnerClass, StatisticClass } from '../src';

describe('core', () =>
{
	let core : CoreClass;

	beforeEach(() =>
	{
		const helper : HelperClass = new HelperClass();
		const option : OptionClass = new OptionClass(helper);
		const spinner : SpinnerClass = new SpinnerClass(option);
		const statistic : StatisticClass = new StatisticClass(helper, option);

		core = new CoreClass(helper, option, spinner, statistic);
	});

	it('valid instance', () =>
	{
		expect(core).to.be.instanceof(CoreClass);
	});
});
