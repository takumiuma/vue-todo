import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import TodoTableTitle from '../TodoTableTitle.vue'

const vuetify = createVuetify({ components, directives })

describe('TodoTableTitle レンダリング', () => {
  it('タイトルが表示されること', () => {
    const wrapper = mount(TodoTableTitle, {
      global: {
        plugins: [vuetify],
      },
      props: { title: 'In progress...', todoList: [] },
    })
    expect(wrapper.text()).toContain('In progress...')
  })

  it('件数チップが表示されること', () => {
    const todoList = [
      { id: 1, content: 'Todo1', pic: '担当者A', time: '2024-01-01 10:00' },
    ]
    const wrapper = mount(TodoTableTitle, {
      global: {
        plugins: [vuetify],
      },
      props: { title: 'In progress...', todoList },
    })
    expect(wrapper.text()).toContain('1')
  })
})
