import * as fs from 'fs';

export class Helper
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
		catch (exception)
		{
			return {};
		}
	}

	readJsonSync(path : fs.PathLike) : object
	{
		return this.parseJson(fs.readFileSync(path, 'utf-8'));
	}
}
