import { expect } from 'chai';
import { mkdir, rmdir, PathLike } from 'fs';
import { HelperClass, OptionClass, StatisticClass } from '../src';

describe('statistic', () =>
{
	let helper : HelperClass;
	let option : OptionClass;
	let statistic : StatisticClass;

	const resolveTestDirectoryPath : Function = () : PathLike =>
	{
		const { path, packageDirectory } = option.getAll();

		return path + '/' + packageDirectory + '/__test__';
	};

	beforeEach(() =>
	{
		helper = new HelperClass();
		option = new OptionClass(helper);
		statistic = new StatisticClass(helper, option);
	});

	it('calc result time', done =>
	{
		statistic.start();
		expect(statistic.calcResultTime()).to.equal(0);
		setTimeout(() =>
		{
			statistic.stop();
			expect(statistic.calcResultTime()).to.be.above(900);
			done();
		}, 1000);
	});

	it('calc result package', done =>
	{
		statistic.start();
		expect(statistic.calcResultPackage()).to.equal(0);
		mkdir(resolveTestDirectoryPath(), () =>
		{
			statistic.stop();
			expect(statistic.calcResultPackage()).to.be.equal(1);
			rmdir(resolveTestDirectoryPath(), () => done());
		});
	});
});
