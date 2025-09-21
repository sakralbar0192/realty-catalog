import type { Meta, StoryObj } from '@storybook/vue3'
import ThemeToggle from '../components/ThemeToggle.vue'

const meta: Meta<typeof ThemeToggle> = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A theme toggle button that switches between light and dark themes.'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default theme toggle with automatic theme detection.'
      }
    }
  }
}
