#!/usr/bin/env node

import { Core, Option, Spinner, Helper } from '.';

(new Core(new Option(new Helper()), new Spinner())).cli(process);
