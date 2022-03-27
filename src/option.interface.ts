import { Manager, Range } from './option.type.js';

export interface Options
{
	config : string;
	manager : Manager;
	managerObject :
	{
		npm : string[];
		pnpm : string[];
		yarn : string[];
	};
	range : Range;
	rangeArray : Range[];
	ignorePrefix : string;
	ignoreArray : string[];
	targetArray : string[];
	filterArray : string[];
	referencePrefix : string;
	spinnerTime : number;
	spinnerArray : string[];
	path : string;
	packageFile : string;
	packageDirectory : string;
}
