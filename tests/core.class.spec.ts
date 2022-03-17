import { expect } from 'chai';
import { CoreClass, OptionClass, SpinnerClass, HelperClass } from '../src';

describe('core', () =>
{
	let core : CoreClass;

	beforeEach(() =>
	{
		const helper : HelperClass = new HelperClass();
		const option : OptionClass = new OptionClass(helper);
		const spinner : SpinnerClass = new SpinnerClass(option);

		core = new CoreClass(option, spinner, helper);
	});

	it('valid instance', () =>
	{
		expect(core).to.be.instanceof(CoreClass);
	});
});
