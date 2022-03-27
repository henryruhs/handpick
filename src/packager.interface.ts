export interface Package
{
	name : string;
	version : string;
	workspace : string[];
	dependencies : Record<string, string>;
	devDependencies : Record<string, string>;
}
