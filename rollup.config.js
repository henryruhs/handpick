import del from 'rollup-plugin-delete';
import ts from 'rollup-plugin-ts';
import shebang from 'rollup-plugin-add-shebang';
import copy from 'rollup-plugin-copy';

export default
{
	input: 'src/cli.ts',
	output:
	{
		file: 'build/cli.js'
	},
	plugins:
	[
		del(
		{
			targets: 'build'
		}),
		ts(),
		shebang(
		{
			include: 'build/cli.js'
		}),
		copy(
		{
			targets:
			[
				{
					src: 'src/assets',
					dest: 'build'
				},
				{
					src: 'package.json',
					dest: 'build'
				},
				{
					src: 'README.md',
					dest: 'build'
				}
			]
		})
	]
}

