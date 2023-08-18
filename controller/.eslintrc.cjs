module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:node/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:eslint-comments/recommended',
    "plugin:@typescript-eslint/recommended",
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:unicorn/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
    warnOnUnsupportedTypeScriptVersion: false,
  },
  plugins: [
    '@typescript-eslint',
    'simple-import-sort',
  ],
  rules: {
    'import/extensions': ['error', 'ignorePackages'],
    // Completly broken with ESM and TypeScript at the moment.
    // See https://github.com/import-js/eslint-plugin-import/issues/2170
    'import/no-unresolved': 'off',
    'node/no-missing-import': 'off',

    'import/first': 'warn',
    'import/newline-after-import': 'warn',
    'import/no-duplicates': 'warn',
    'simple-import-sort/imports': ['warn', {
      groups: [
        ['^\\u0000'],
        ['^@?\\w', '^@?\\w.*\\u0000$'],
        ['(?<!\\u0000)$', '(?<=\\u0000)$'],
        ['^\\.', '^\\..*\\u0000$'],
      ],
    }],
    'simple-import-sort/exports': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'error',
    'no-return-await': 'off',
    '@typescript-eslint/return-await': 'off',
    'max-len': ['warn', {
      code: 100,
      tabWidth: 2,
      ignorePattern: "\/\/ eslint-disable-next-line",
      ignoreStrings: true,
      ignoreUrls: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
    }],
    'indent': 'off',
    'function-paren-newline': 'off',
    '@typescript-eslint/consistent-type-imports': ['warn', {
      prefer: 'type-imports',
    }],
    'unicorn/no-useless-undefined': 'off',
    'node/no-unsupported-features/es-syntax': [ // to allow import and export declarations in *.ts file
      'error',
      { ignores: ['modules'] },
    ],
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
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': [
        '.ts',
      ],
    },
  }
};
