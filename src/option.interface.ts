import { Manager, Range } from './option.type';

export interface Options
{
	config : string;
	manager : Manager;
	managerObject :
	{
		npm : string[];
		pnpm : string[];
		yarn : string[];
	},
	range : Range;
	rangeArray : Range[];
	ignorePrefix : string;
	ignoreArray : string[];
	targetArray : string[];
	filterArray : string[];
	path : string;
	packageFile : string;
	packageDirectory : string;
}
