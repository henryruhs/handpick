#!/usr/bin/env node

import { CoreClass, HelperClass, OptionClass, SpinnerClass, StatisticClass } from './index.js';

const helper : HelperClass = new HelperClass();
const option : OptionClass = new OptionClass(helper);
const spinner : SpinnerClass = new SpinnerClass(option);
const statistic : StatisticClass = new StatisticClass(helper, option);
const core : CoreClass = new CoreClass(helper, option, spinner, statistic);

core.cli(process);
