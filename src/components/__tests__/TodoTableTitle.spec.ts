import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import TodoTableTitle from '../TodoTableTitle.vue'

const vuetify = createVuetify({ components, directives })

const globalConfig = {
  global: {
    plugins: [vuetify],
  },
}

describe('TodoTableTitle', () => {
  describe('totalNum()', () => {
    it('todoListが空の場合0を返すこと', () => {
      const wrapper = mount(TodoTableTitle, {
        ...globalConfig,
        props: { title: 'In progress...', todoList: [] },
      })
      expect((wrapper.vm as any).totalNum()).toBe(0)
    })

    it('todoListに要素がある場合その件数を返すこと', () => {
      const todoList = [
        { id: 1, content: 'Todo1', pic: '担当者A', time: '2024-01-01 10:00' },
        { id: 2, content: 'Todo2', pic: '担当者B', time: '2024-01-02 10:00' },
      ]
      const wrapper = mount(TodoTableTitle, {
        ...globalConfig,
        props: { title: 'In progress...', todoList },
      })
      expect((wrapper.vm as any).totalNum()).toBe(2)
    })
  })

  describe('titleColor()', () => {
    it('titleが"In progress..."の場合"unfinished"を返すこと', () => {
      const wrapper = mount(TodoTableTitle, {
        ...globalConfig,
        props: { title: 'In progress...', todoList: [] },
      })
      expect((wrapper.vm as any).titleColor()).toBe('unfinished')
    })

    it('titleが"In progress..."の場合messageが"全てを完了に移動"になること', () => {
      const wrapper = mount(TodoTableTitle, {
        ...globalConfig,
        props: { title: 'In progress...', todoList: [] },
      })
      ;(wrapper.vm as any).titleColor()
      expect((wrapper.vm as any).message).toBe('全てを完了に移動')
    })

    it('titleが"Done!!"の場合"finished"を返すこと', () => {
      const wrapper = mount(TodoTableTitle, {
        ...globalConfig,
        props: { title: 'Done!!', todoList: [] },
      })
      expect((wrapper.vm as any).titleColor()).toBe('finished')
    })

    it('titleが"Done!!"の場合messageが"全てを着手中に移動"になること', () => {
      const wrapper = mount(TodoTableTitle, {
        ...globalConfig,
        props: { title: 'Done!!', todoList: [] },
      })
      ;(wrapper.vm as any).titleColor()
      expect((wrapper.vm as any).message).toBe('全てを着手中に移動')
    })
  })

  describe('sendEmpty()', () => {
    it('"clear-click"イベントを空配列とともにemitすること', async () => {
      const wrapper = mount(TodoTableTitle, {
        ...globalConfig,
        props: {
          title: 'In progress...',
          todoList: [{ id: 1, content: 'Todo1' }],
        },
      })
      ;(wrapper.vm as any).sendEmpty()
      expect(wrapper.emitted('clear-click')).toBeTruthy()
      expect(wrapper.emitted('clear-click')![0][0]).toEqual([])
    })
  })

  describe('sendList()', () => {
    it('"move-click"イベントをtodoListとともにemitすること', async () => {
      const todoList = [
        { id: 1, content: 'Todo1' },
        { id: 2, content: 'Todo2' },
      ]
      const wrapper = mount(TodoTableTitle, {
        ...globalConfig,
        props: { title: 'In progress...', todoList },
      })
      ;(wrapper.vm as any).sendList()
      expect(wrapper.emitted('move-click')).toBeTruthy()
      expect(wrapper.emitted('move-click')![0][0]).toEqual(todoList)
    })
  })
})
