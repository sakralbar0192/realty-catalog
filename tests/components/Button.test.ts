import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '~/components/Button.vue'

describe('Button', () => {
  it('renders slot content', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me',
      },
    })

    expect(wrapper.text()).toBe('Click me')
  })

  it('emits click event when clicked', async() => {
    const wrapper = mount(Button)

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'secondary',
        size: 'large',
      },
    })

    // With CSS modules, class names are hashed, so we check the count
    expect(wrapper.classes()).toHaveLength(3) // button, variant, size
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('has correct accessibility attributes', () => {
    const wrapper = mount(Button, {
      props: {
        ariaLabel: 'Test button',
      },
    })

    expect(wrapper.attributes('aria-label')).toBe('Test button')
  })
})
