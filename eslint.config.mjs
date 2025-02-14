import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

// Konwersja do nowego formatu flat-config
const compat = new FlatCompat({
  baseDirectory: import.meta.url,
  resolvePluginsRelativeTo: import.meta.url,
});

export default [
  js.configs.recommended,  // Domyślne ustawienia zalecane przez ESLint
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2015,
      sourceType: 'module',
      globals: {
        document: 'readonly', // Definiowanie globalnych zmiennych
        console: 'readonly',
        Handlebars: 'readonly',
      },
    },
    rules: {
      indent: ['error', 4],
      'linebreak-style': ['off'],
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      semi: ['error', 'always'],
      'no-console': 'off',
      'no-prototype-builtins': 'off',
    },
  },
];
