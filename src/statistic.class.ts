import { existsSync, readdirSync, PathLike } from 'fs';
import { OptionClass } from './option.class.js';
import { HelperClass } from './helper.class.js';

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
		return this.stopTime ? this.stopTime - this.startTime : 0;
	}

	calcResultPackage() : number
	{
		return this.stopPackage ? this.stopPackage - this.startPackage : 0;
	}

	protected countPackages() : number
	{
		return existsSync(this.resolveDirectoryPath()) ? readdirSync(this.resolveDirectoryPath()).length : 0;
	}

	protected resolveDirectoryPath() : PathLike
	{
		const { path, packageDirectory } = this.option.getAll();

		return path + '/' + packageDirectory;
	}
}
