import os from 'os';
import { readFileSync, existsSync, PathLike } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export class Helper
{
	parseJson(content : string) : object
	{
		try
		{
			return JSON.parse(content);
		}
		catch
		{
			return {};
		}
	}

	stringifyObject(dataObject : object, indent : number = 2) : string
	{
		const content : string = JSON.stringify(dataObject, null, indent) + os.EOL;
		const pattern : RegExp = new RegExp(os.EOL, 'g');

		return content.replace(pattern, os.EOL);
	}

	resolveAbsolutePath(path : string) : PathLike
	{
		return dirname(fileURLToPath(import.meta.url)) + '/' + path;
	}

	readJson(path : PathLike) : object
	{
		return existsSync(path) ? this.parseJson(readFileSync(path, 'utf-8')) : {};
	}

	readJsonFromAbsolutePath(path : string) : object
	{
		return this.readJson(this.resolveAbsolutePath(path));
	}
}
