#!/usr/bin/env node

import { Core, Option, Spinner } from '.';

(new Core(new Option(), new Spinner())).cli(process);
