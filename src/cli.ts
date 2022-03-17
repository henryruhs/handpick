#!/usr/bin/env node

import { CoreClass, OptionClass, SpinnerClass, HelperClass } from './index.js';

const helper : HelperClass = new HelperClass();
const option : OptionClass = new OptionClass(helper);
const spinner : SpinnerClass = new SpinnerClass(option);
const core : CoreClass = new CoreClass(option, spinner, helper);

core.cli(process);
