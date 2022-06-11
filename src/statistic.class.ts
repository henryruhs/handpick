import { existsSync, readdirSync, PathLike } from 'fs';
import { Option } from './option.class.js';
import { Helper } from './helper.class.js';

export class Statistic
{
	protected startTime : number = 0;
	protected stopTime : number = 0;
	protected startPackage : number = 0;
	protected stopPackage : number = 0;

	constructor(protected helper : Helper, protected option : Option)
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
		const { path, packageDirectory } : { path : string, packageDirectory : string } = this.option.getAll();

		return path + '/' + packageDirectory;
	}
}
