import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '~/components/Button.vue'

describe('Button snapshots', () => {
  it('matches default snapshot', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Default Button',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches secondary variant snapshot', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'secondary',
      },
      slots: {
        default: 'Secondary Button',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches disabled state snapshot', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
      slots: {
        default: 'Disabled Button',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
