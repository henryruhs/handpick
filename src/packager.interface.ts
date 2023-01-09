export interface Dependencies extends Record<string, string> {}

export interface Package
{
	name : string;
	version : string;
	workspace : string[];
	dependencies : Dependencies;
	devDependencies : Dependencies;
}
