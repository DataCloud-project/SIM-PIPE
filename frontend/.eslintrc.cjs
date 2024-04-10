/** @type { import("eslint").Linter.FlatConfig } */
module.exports = {
	root: true,
	extends: [
		'plugin:import/recommended',
		'plugin:import/typescript',
		'plugin:eslint-comments/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'airbnb-base',
		'airbnb-typescript/base',
		'plugin:unicorn/recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'simple-import-sort'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte'],
		tsconfigRootDir: __dirname,
		project: './tsconfig.json',
		warnOnUnsupportedTypeScriptVersion: false
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	],
	rules: {
		'import/extensions': 'off',
		'import/no-unresolved': 'off',
		'import/first': 'warn',
		'import/newline-after-import': 'warn',
		'import/no-duplicates': 'warn',
		'import/no-extraneous-dependencies': 'off',
		'simple-import-sort/imports': [
			'warn',
			{
				groups: [
					['^\\u0000'],
					['^@?\\w', '^@?\\w.*\\u0000$'],
					['(?<!\\u0000)$', '(?<=\\u0000)$'],
					['^\\.', '^\\..*\\u0000$']
				]
			}
		],
		'import/prefer-default-export': 'off',
		'import/no-mutable-exports': 'off',
		'simple-import-sort/exports': 'warn',
		'no-await-in-loop': 'warn',
		'no-return-await': 'off',
		'no-await-in-loop': 'off',
		'no-alert': 'warn',
		'no-unsafe-optional-chaining': 'warn',
		'svelte/no-at-html-tags': 'warn',
		'object-shorthand': 'warn',
		'spaced-comment': 'warn',
		'prefer-arrow-callback': 'warn',
		'@typescript-eslint/return-await': 'off',
		indent: 'off',
		'function-paren-newline': 'off',
		'@typescript-eslint/consistent-type-imports': [
			'warn',
			{
				prefer: 'type-imports'
			}
		],
		'unicorn/no-useless-undefined': 'off',
		'unicorn/no-array-for-each': 'off',
		'unicorn/prefer-top-level-await': 'warn',
		'unicorn/prevent-abbreviations': 'off',
		'unicorn/prefer-logical-operator-over-ternary': 'warn',
		'unicorn/new-for-builtins': 'off',
		'unicorn/filename-case': 'warn',
		'no-console': 'off',
		'prefer-for-of': 'off',
		'no-restricted-syntax': 'off',
		'import/no-self-import': 'off',
		'no-shadow': 'off',
		'@typescript-eslint/no-shadow': 'off',
		'simple-import-sort/imports': 'off',
		'@typescript-eslint/explicit-function-return-type': 'warn',
		'@typescript-eslint/no-floating-promises': 'warn',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unused-vars': 'warn',
		'@typescript-eslint/no-unused-expressions': 'warn',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
		'@typescript-eslint/no-unsafe-argument': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off'
	}
};
