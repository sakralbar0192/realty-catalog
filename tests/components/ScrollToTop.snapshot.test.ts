import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ScrollToTop from '~/components/ScrollToTop.vue'

describe('ScrollToTop Snapshots', () => {
  it('should match snapshot when hidden', () => {
    const wrapper = mount(ScrollToTop, {
      global: {
        mocks: {
          $t: () => 'Scroll to top',
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot when visible', () => {
    // Mock scroll position
    Object.defineProperty(window, 'scrollY', {
      value: 400,
      writable: true,
    })

    const wrapper = mount(ScrollToTop, {
      global: {
        mocks: {
          $t: () => 'Scroll to top',
        },
      },
    })

    // Trigger scroll event
    window.dispatchEvent(new Event('scroll'))

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot with focus styles', async() => {
    Object.defineProperty(window, 'scrollY', {
      value: 400,
      writable: true,
    })

    const wrapper = mount(ScrollToTop, {
      global: {
        mocks: {
          $t: () => 'Scroll to top',
        },
      },
    })

    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    const button = wrapper.find('button')
    await button.trigger('focus')

    expect(wrapper.html()).toMatchSnapshot()
  })
})
