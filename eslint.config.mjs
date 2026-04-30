import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
// import eslintConfigPrettier from 'eslint-config-prettier/flat';
// import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      semi: 0,
      'react/jsx-filename-extension': [
        1,
        {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      ],
      'jsx-a11y/no-static-element-interactions': 0,
      'import/no-extraneous-dependencies': 0,
      'import/extensions': 0,
      'jsx-a11y/alt-text': 0,
      'no-unused-vars': 'warn',
      'no-underscore-dangle': 0,
      'react/no-array-index-key': 0,
      'react/prop-types': 0,
      'react/jsx-props-no-spreading': 0,
      'react/react-in-jsx-scope': 0,
      'react/function-component-definition': 0,
      'jsx-a11y/control-has-associated-label': 0,
      'react/display-name': 0,
      'import/prefer-default-export': 0,
      'react/require-default-props': 0,
      'react/no-unused-prop-types': 0,
      '@typescript-eslint/no-explicit-any': [
        'warn',
        {
          ignoreRestArgs: true
        }
      ],
      'react/no-unescaped-entities': 0,
      'react/button-has-type': 'warn',
      // 'react/input-has-type': 'warn',
      'max-len': [
        'warn',
        {
          code: 200,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true
        }
      ],
      'no-nested-ternary': 0,
      indent: ['error', 2],
      // 'indent': 'off', // Disabled: conflicts with TypeScript/JSX, causes stack overflow
      quotes: ['error', 'single', { avoidEscape: true }],
      'comma-dangle': 'warn',
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'space-before-function-paren': 'off',
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error', 'info']
        }
      ],
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      'arrow-parens': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-undef': 'error',
      'no-bitwise': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'warn'
      // 'no-restricted-globals': 'warn',
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts'
  ])
  // Prettier must be last to override conflicting rules
  // eslintConfigPrettier,
  // eslintPluginPrettierRecommended,
  // {
  //   rules: {
  //     'prettier/prettier': 'warn'
  //   }
  // }
]);

export default eslintConfig;
