import { FlatCompat } from '@eslint/eslintrc';
import next from 'eslint-config-next';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  ...next,
  ...compat.config({
    extends: ['prettier'],
  }),
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'src-tauri/**'],
  },
];

export default eslintConfig;
