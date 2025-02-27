import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const baseConfig = [...compat.extends('./base.json')];
const apiConfig = [...compat.extends('./api.json')];
const nextJsConfig = [...compat.extends('./nextjs.json')];

export { apiConfig, baseConfig, nextJsConfig };
