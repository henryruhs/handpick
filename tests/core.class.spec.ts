import { expect } from 'chai';
import { CoreClass, HelperClass, OptionClass, PackagerClass, SpinnerClass, StatisticClass } from '../src';

describe('core', () =>
{
	let helper : HelperClass;
	let option : OptionClass;
	let packager : PackagerClass;
	let spinner : SpinnerClass;
	let statistic : StatisticClass;
	let core : CoreClass;

	beforeEach(() =>
	{
		helper = new HelperClass();
		option = new OptionClass(helper);
		packager = new PackagerClass(helper, option);
		spinner = new SpinnerClass(option);
		statistic = new StatisticClass(helper, option);
		core = new CoreClass(helper, option, packager, spinner, statistic);
	});

	it('valid instance', () =>
	{
		expect(core).to.be.instanceof(CoreClass);
	});
});
