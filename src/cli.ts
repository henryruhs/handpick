#!/usr/bin/env node

import { CoreClass, HelperClass, OptionClass, PackagerClass, SpinnerClass, StatisticClass } from './index.js';

const helper : HelperClass = new HelperClass();
const option : OptionClass = new OptionClass(helper);
const packager : PackagerClass = new PackagerClass(helper, option);
const spinner : SpinnerClass = new SpinnerClass(option);
const statistic : StatisticClass = new StatisticClass(helper, option);
const core : CoreClass = new CoreClass(helper, option, packager, spinner, statistic);

core.cli(process);
