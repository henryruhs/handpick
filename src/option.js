const extend = require('extend');

let optionArray = require('../option.json');

/**
 * get
 *
 * @since 1.0.0
 *
 * @param name string
 *
 * @return string
 */

function get(name)
{
	return optionArray[name];
}

/**
 * set
 *
 * @since 1.0.0
 *
 * @param name string
 * @param name string
 */

function set(name, value)
{
	optionArray[name] = value;
}

/**
 * init
 *
 * @since 1.0.0
 *
 * @param initArray array
 */

function init(initArray)
{
	optionArray = extend(optionArray, initArray);
}

module.exports =
{
	get,
	set,
	init
};