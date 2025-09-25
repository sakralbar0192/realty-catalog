import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SortIcon from '~/components/SortIcon.vue'

describe('SortIcon', () => {
  it('should render with default state', () => {
    const wrapper = mount(SortIcon)

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.findAll('svg')).toHaveLength(2) // Two chevrons
  })

  it('should receive direction prop correctly', () => {
    const wrapper = mount(SortIcon, {
      props: {
        direction: 'asc',
      },
    })

    expect(wrapper.props('direction')).toBe('asc')
  })

  it('should handle different direction values', () => {
    const wrapperAsc = mount(SortIcon, {
      props: { direction: 'asc' },
    })
    const wrapperDesc = mount(SortIcon, {
      props: { direction: 'desc' },
    })
    const wrapperNull = mount(SortIcon, {
      props: { direction: null },
    })

    expect(wrapperAsc.props('direction')).toBe('asc')
    expect(wrapperDesc.props('direction')).toBe('desc')
    expect(wrapperNull.props('direction')).toBe(null)
  })

  it('should have proper data-test attribute', () => {
    const wrapper = mount(SortIcon, {
      props: {
        direction: 'asc',
      },
    })

    expect(wrapper.attributes('data-test')).toBe('sort-icon-asc')
  })
})
