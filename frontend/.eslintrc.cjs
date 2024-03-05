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
		'simple-import-sort/imports': ['warn', {
			groups: [
				['^\\u0000'],
				['^@?\\w', '^@?\\w.*\\u0000$'],
				['(?<!\\u0000)$', '(?<=\\u0000)$'],
				['^\\.', '^\\..*\\u0000$'],
			],
		}],
		'import/prefer-default-export': 'off',
		'import/no-mutable-exports': 'off',
		'simple-import-sort/exports': 'warn',
		'@typescript-eslint/explicit-function-return-type': 'error',
		'no-return-await': 'off',
		'@typescript-eslint/return-await': 'off',
		'indent': 'off',
		'function-paren-newline': 'off',
		'@typescript-eslint/consistent-type-imports': ['warn', {
			prefer: 'type-imports',
		}],
		'unicorn/no-useless-undefined': 'off',
		'unicorn/no-array-for-each': 'off',
		'no-console': 'off',
		'prefer-for-of': 'off',
		'no-restricted-syntax': 'off',
		'import/no-self-import': 'off',
		'no-shadow': 'off',
		'@typescript-eslint/no-shadow': 'off',
		'simple-import-sort/imports': 'off',
		'@typescript-eslint/explicit-function-return-type': [{'allowExpressions': true}],
	}
};
