import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SortIcon from '~/components/SortIcon.vue'

describe('SortIcon Snapshots', () => {
  it('should match snapshot when no direction', () => {
    const wrapper = mount(SortIcon)

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot when direction is asc', () => {
    const wrapper = mount(SortIcon, {
      props: {
        direction: 'asc',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot when direction is desc', () => {
    const wrapper = mount(SortIcon, {
      props: {
        direction: 'desc',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot when direction is null', () => {
    const wrapper = mount(SortIcon, {
      props: {
        direction: null,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
