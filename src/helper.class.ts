import * as fs from 'fs';
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

	readJsonSync(path : fs.PathLike) : object
	{
		return this.parseJson(fs.readFileSync(path, 'utf-8'));
	}

	resolvePath(path : string) : string
	{
		return dirname(fileURLToPath(import.meta.url)) + '/' + path;
	}
}
