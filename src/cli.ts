#!/usr/bin/env node

import { CoreClass, OptionClass, SpinnerClass, HelperClass } from './index.js';

(new CoreClass(new OptionClass(new HelperClass()), new SpinnerClass(), new HelperClass())).cli(process);
