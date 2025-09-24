import storybook from 'eslint-plugin-storybook'

import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import vuejsAccessibility from 'eslint-plugin-vuejs-accessibility'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import globals from 'globals'

const nuxtGlobals = {
  // Vue Composition API
  ref: 'readonly',
  computed: 'readonly',
  reactive: 'readonly',
  watch: 'readonly',
  watchEffect: 'readonly',
  onMounted: 'readonly',
  onUnmounted: 'readonly',
  onBeforeMount: 'readonly',
  onBeforeUnmount: 'readonly',
  onUpdated: 'readonly',
  onBeforeUpdate: 'readonly',
  nextTick: 'readonly',
  readonly: 'readonly',
  // Nuxt
  defineNuxtConfig: 'readonly',
  defineNuxtPlugin: 'readonly',
  defineEventHandler: 'readonly',
  getQuery: 'readonly',
  useHead: 'readonly',
  useState: 'readonly',
  useFetch: 'readonly',
  $fetch: 'readonly',
  navigateTo: 'readonly',
  useRouter: 'readonly',
  useRoute: 'readonly',
  // Pinia
  useMainStore: 'readonly',
  // Other
  useCssModule: 'readonly',
  usePerformance: 'readonly',
}

export default [{
  ignores: [
    'node_modules',
    '.nuxt',
    '.output',
    'dist',
    'build',
    'coverage',
    '.nyc_output',
    '.cache',
    '.vscode',
    '.idea',
    '*.min.js',
    'public/mockServiceWorker.js',
  ],
}, js.configs.recommended, {
  files: ['**/*.ts', '**/*.js'],
  languageOptions: {
    parser: tsParser,
    globals: {
      ...globals.node,
      ...globals.browser,
      ...nuxtGlobals,
    },
  },
  plugins: {
    '@typescript-eslint': tseslint,
  },
  rules: {
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': ['error', {
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_',
    }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',

    'no-console': 'warn',
    'no-debugger': 'warn',

    // Code style rules
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'no-tabs': 'error', // Explicitly forbid tabs
    'comma-dangle': ['error', 'always-multiline'],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1, maxBOF: 0 }],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'key-spacing': ['error'],
    'space-before-function-paren': ['error', 'never'],
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'spaced-comment': ['error', 'always'],
    'brace-style': ['error', '1tbs'],
    'comma-spacing': ['error', { before: false, after: true }],
    'func-call-spacing': ['error', 'never'],
    'keyword-spacing': 'error',
    'no-trailing-spaces': ['error', { skipBlankLines: false, ignoreComments: false }],
    'eol-last': ['error', 'always'],
    'linebreak-style': ['error', 'unix'],

    // General rules
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'no-else-return': 'error',
    'no-lonely-if': 'error',
  },
}, {
  files: ['**/*.vue'],
  languageOptions: {
    parser: vueParser,
    parserOptions: {
      parser: tsParser,
      extraFileExtensions: ['.vue'],
    },
    globals: {
      ...globals.browser,
      ...globals.node,
      ...nuxtGlobals,
    },
  },
  plugins: {
    vue,
    'vuejs-accessibility': vuejsAccessibility,
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-vars': 'error',
    'vue/require-v-for-key': 'error',
    'vue/no-use-v-if-with-v-for': 'error',
    'vue/html-self-closing': ['error', {
      'html': {
        'void': 'always',
        'normal': 'never',
        'component': 'always',
      },
      'svg': 'always',
      'math': 'always',
    }],
    'vuejs-accessibility/click-events-have-key-events': 'error',
    'vuejs-accessibility/mouse-events-have-key-events': 'error',
    'vuejs-accessibility/alt-text': 'error',
    'vuejs-accessibility/anchor-has-content': 'error',
    'vuejs-accessibility/heading-has-content': 'error',
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/prop-name-casing': ['error', 'camelCase'],
    'vue/v-slot-style': ['error', 'shorthand'],
    'vue/custom-event-name-casing': ['error', 'camelCase'],
    // Vue style rules
    'vue/html-indent': ['error', 2],
    'vue/script-indent': ['error', 2],
    'vue/html-quotes': ['error', 'double'],
    'vue/max-attributes-per-line': ['error', {
      'singleline': 3,
      'multiline': 1,
    }],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',

    // Prevent <style> blocks in Vue components
    'vue/no-restricted-syntax': [
      'error',
      {
        selector: 'VElement[name=style]',
        message: 'Style blocks are not allowed in Vue components. Use separate SCSS files instead.',
      },
    ],
  },
}, ...storybook.configs['flat/recommended']]
