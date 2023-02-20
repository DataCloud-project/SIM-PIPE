module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:node/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:eslint-comments/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:unicorn/recommended',
    'plugin:svelte/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['*.cjs'],
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  ],
  /*settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
  },*/
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
    extraFileExtensions: ['.svelte'],
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  rules: {
    'import/extensions': ['error', 'ignorePackages'],
    // Completly broken with ESM and TypeScript at the moment.
    // See https://github.com/import-js/eslint-plugin-import/issues/2170
    'import/no-unresolved': 'off',
    'node/no-missing-import': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],

    'import/first': 'warn',
    'import/newline-after-import': 'warn',
    'import/no-duplicates': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'error',
    'no-return-await': 'off',
    '@typescript-eslint/return-await': 'off',
    'max-len': [
      'warn',
      {
        code: 120,
        tabWidth: 2,
        ignorePattern: '// eslint-disable-next-line',
      },
    ],
    indent: 'off',
    'function-paren-newline': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
      },
    ],
    'unicorn/no-useless-undefined': 'off',
    'node/no-unsupported-features/es-syntax': [
      // to allow import and export declarations in *.ts file
      'error',
      { ignores: ['modules'] },
    ],
    'node/no-unpublished-import': 'off',
    'import/first': 'off',
    // Svelte crap
    'import/prefer-default-export': 'off',
    'import/no-mutable-exports': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    'import/extensions': ['error', 'ignorePackages'],
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        version: '>=16.0.0',
        ignores: ['modules'],
      },
    ],
    'unicorn/prefer-top-level-await': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'type'],
      },
    ],
    'unicorn/prevent-abbreviations': [
      'error',
      {
        ignore: ['Def'],
      },
    ],
  },
};
