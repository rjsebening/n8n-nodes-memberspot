import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import n8nPlugin from 'eslint-plugin-n8n-nodes-base';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended, // ESLint JS defaults
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier,
      'n8n-nodes-base': n8nPlugin,
    },
    rules: {
      'prettier/prettier': 'warn',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  eslintConfigPrettier, // disables conflicting rules with Prettier
];
