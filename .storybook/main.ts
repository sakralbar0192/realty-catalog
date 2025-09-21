import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [],
  'framework': {
    'name': '@storybook-vue/nuxt',
    'options': {},
  },
  docs: {
    // autodocs is enabled by default in Storybook 9
  },
  typescript: {
    check: false,
  },
  viteFinal: (config) => {
    // Add Nuxt-specific aliases
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '~': new URL('../', import.meta.url).pathname,
      '@': new URL('../', import.meta.url).pathname,
    }

    return config
  },
}

export default config
