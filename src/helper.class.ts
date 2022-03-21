import os from 'os';
import { readFileSync, PathLike } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export class HelperClass
{
	tidy(dirtyObject : object) : object
	{
		return JSON.parse(JSON.stringify(dirtyObject));
	}

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

	readJsonSync(path : PathLike) : object
	{
		return this.parseJson(readFileSync(path, 'utf-8'));
	}

	resolveAbsolutePath(path : string) : PathLike
	{
		return dirname(fileURLToPath(import.meta.url)) + '/' + path;
	}
}
