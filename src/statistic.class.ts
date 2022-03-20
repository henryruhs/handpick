import { existsSync, readdirSync, PathLike } from 'fs';
import { OptionClass } from './option.class.js';
import { HelperClass } from './helper.class';

export class StatisticClass
{
	protected startTime : number = 0;
	protected stopTime : number = 0;
	protected startPackage : number = 0;
	protected stopPackage : number = 0;

	constructor(protected helper : HelperClass, protected option : OptionClass)
	{
	}

	start() : this
	{
		this.startTime = Date.now();
		this.startPackage = this.countPackages();
		return this;
	}

	stop() : this
	{
		this.stopTime = Date.now();
		this.stopPackage = this.countPackages();
		return this;
	}

	calcResultTime() : number
	{
		return this.stopTime - this.stopTime;
	}

	calcResultPackage() : number
	{
		return this.startPackage - this.stopPackage;
	}

	protected countPackages() : number
	{
		const { path, packageDirectory } = this.option.getAll();
		const absolutePath : PathLike = this.helper.resolveAbsolutePath(path + '/' + packageDirectory);

		return existsSync(absolutePath) ? readdirSync(absolutePath).length : 0;
	}
}
