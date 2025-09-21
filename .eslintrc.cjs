module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxt/eslint-config',
    'plugin:vue/vue3-recommended',
    'plugin:vuejs-accessibility/recommended'
  ],
  plugins: [
    'vue',
    'vuejs-accessibility'
  ],
  rules: {
    // Vue specific rules
    'vue/multi-word-component-names': 'off', // Allow single word names
    'vue/no-unused-vars': 'error',
    'vue/require-v-for-key': 'error',
    'vue/no-use-v-if-with-v-for': 'error',
    'vue/html-self-closing': ['error', {
      'html': {
        'void': 'always',
        'normal': 'never',
        'component': 'always'
      },
      'svg': 'always',
      'math': 'always'
    }],
    
    // Accessibility rules
    'vuejs-accessibility/click-events-have-key-events': 'error',
    'vuejs-accessibility/mouse-events-have-key-events': 'error',
    'vuejs-accessibility/alt-text': 'error',
    'vuejs-accessibility/anchor-has-content': 'error',
    'vuejs-accessibility/heading-has-content': 'error',
    
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': ['error', { 
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_'
    }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    
    // General rules
    // eslint-disable-next-line no-undef
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    // eslint-disable-next-line no-undef
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'prefer-const': 'error',
    'no-var': 'error'
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        // Special rules for Vue files
        'vue/component-definition-name-casing': ['error', 'PascalCase'],
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'vue/prop-name-casing': ['error', 'camelCase'],
        'vue/v-slot-style': ['error', 'shorthand'],
        'vue/custom-event-name-casing': ['error', 'camelCase']
      }
    }
  ]
}
