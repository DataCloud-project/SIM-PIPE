module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:node/recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:unicorn/recommended',
    'plugin:eslint-comments/recommended',
    "plugin:@typescript-eslint/recommended",
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
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
    }],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': [
        '.ts',
      ],
    },
  },
};
