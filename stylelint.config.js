export default {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue',
  ],
  customSyntax: 'postcss-html',
  rules: {
    // BEM methodology rules
    'selector-class-pattern': [
      '^(?:[a-z][a-zA-Z0-9]*)(?:-[a-zA-Z0-9]+)*(?:__[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:--[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?$',
      {
        message: 'Expected class selector to follow BEM methodology (block, block__element, block--modifier, block__element--modifier)',
      },
    ],

    // Vue scoped styles
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global', 'slotted'],
      },
    ],

    // CSS Modules
    'selector-pseudo-class-disallowed-list': null,

    // Allow SCSS at-rules in Vue
    'at-rule-no-unknown': null,

    // Custom properties (CSS variables)
    'custom-property-pattern': '^--[a-z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*$',

    // SCSS patterns
    'scss/dollar-variable-pattern': '^[_]?[a-z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*$',
    'scss/at-mixin-pattern': '^[_]?[a-z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*$',
    'scss/at-function-pattern': '^[_]?[a-z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*$',

    // Allow CSS variables
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['/^--/'],
      },
    ],

    // Allow modern CSS features
    'declaration-block-no-redundant-longhand-properties': null,
    'shorthand-property-no-redundant-values': null,

    // Color and typography
    'color-hex-length': 'short',
    'color-named': 'never',
    'font-family-name-quotes': 'always-where-recommended',

    // Units
    'unit-allowed-list': ['px', 'rem', 'em', '%', 'vh', 'vw', 'vmin', 'vmax', 's', 'ms', 'deg', 'fr'],

    // Nesting
    'max-nesting-depth': 3,
    'scss/selector-no-redundant-nesting-selector': true,

    // Performance
    'plugin/no-low-performance-animation-properties': [
      true,
      {
        ignore: 'paint-properties',
      },
    ],

    // Allow comments in SCSS
    'scss/double-slash-comment-whitespace-inside': null,
    'scss/double-slash-comment-empty-line-before': null,
    'comment-empty-line-before': null,
    'comment-whitespace-inside': null,
  },
  ignores: [
    'node_modules/**/*',
    '.nuxt/**/*',
    '.output/**/*',
    'dist/**/*',
    'build/**/*',
    'coverage/**/*',
    '.cache/**/*',
    'public/**/*',
  ],
}
