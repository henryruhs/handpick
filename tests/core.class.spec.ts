import { CoreClass, OptionClass, SpinnerClass, HelperClass } from '../src';

describe('Core', () =>
{
	it('create instance', done =>
	{
		new CoreClass(new OptionClass(new HelperClass()), new SpinnerClass(), new HelperClass());
		done();
	});
});
