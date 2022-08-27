import { expect } from 'chai';
import { mkdir, rmdir, PathLike } from 'fs';
import { Helper, Option, Statistic } from '../src';

describe('statistic', () =>
{
	let helper : Helper;
	let option : Option;
	let statistic : Statistic;

	const resolveTestDirectoryPath : Function = () : PathLike =>
	{
		const { path, packageDirectory } : { path : string, packageDirectory : string } = option.getAll();

		return path + '/' + packageDirectory + '/__test__';
	};

	beforeEach(() =>
	{
		helper = new Helper();
		option = new Option(helper);
		statistic = new Statistic(option);
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
