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
		packager = new PackagerClass(option);
		spinner = new SpinnerClass(option);
		statistic = new StatisticClass(helper, option);
		core = new CoreClass(helper, option, packager, spinner, statistic);
	});

	it('valid instance', () =>
	{
		expect(core).to.be.instanceof(CoreClass);
	});

	it('start wording', () =>
	{
		option.init(
		{
			path: 'tests/provider'
		});
		expect(core.startWording()).to.equal('Hand picking DIRTY dependencies and devDependencies via NPM');
		option.set('manager', 'yarn');
		option.set('range', 'exact');
		option.set('targetArray',
		[
			'devDependencies'
		]);
		option.set('filterArray',
		[
			'lintDependencies'
		]);
		expect(core.startWording()).to.equal('Hand picking EXACT devDependencies without lintDependencies via YARN');
	});

	it('end wording', () =>
	{
		option.init(
		{
			path: 'tests/provider'
		});
		expect(core.endWording(1, 1)).to.equal('Done 1 package in 1.00 second');
		expect(core.endWording(2, 2)).to.equal('Done 2 packages in 2.00 seconds');
	});
});
