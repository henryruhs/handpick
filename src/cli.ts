import { Core, Helper, Option, Packager, Spinner, Statistic } from './index.js';

const helper : Helper = new Helper();
const option : Option = new Option(helper);
const packager : Packager = new Packager(option);
const spinner : Spinner = new Spinner(option);
const statistic : Statistic = new Statistic(helper, option);
const core : Core = new Core(helper, option, packager, spinner, statistic);

core.cli(process);
