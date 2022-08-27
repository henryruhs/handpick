import { expect } from 'chai';
import { Core, Helper, Option, Packager, Spinner, Statistic } from '../src';

describe('core', () =>
{
	let helper : Helper;
	let option : Option;
	let packager : Packager;
	let spinner : Spinner;
	let statistic : Statistic;
	let core : Core;

	beforeEach(() =>
	{
		helper = new Helper();
		option = new Option(helper);
		packager = new Packager(option);
		spinner = new Spinner(option);
		statistic = new Statistic(option);
		core = new Core(helper, option, packager, spinner, statistic);
	});

	it('start wording', () =>
	{
		option.init(
		{
			path: 'tests/provider'
		});
		expect(core.startWording()).to.equal('Picking DIRTY dependencies and devDependencies via NPM');
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
		expect(core.startWording()).to.equal('Picking EXACT devDependencies without lintDependencies via YARN');
	});

	it('end wording', () =>
	{
		option.init(
		{
			path: 'tests/provider'
		});
		expect(core.endWording(1000, 1)).to.equal('Done 1 package in 1.00 second');
		expect(core.endWording(2000, 2)).to.equal('Done 2 packages in 2.00 seconds');
	});
});
