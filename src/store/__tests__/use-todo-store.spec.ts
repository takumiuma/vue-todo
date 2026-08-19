import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import axios from 'axios'
import { useTodoStore } from '../use-todo-store'

vi.mock('axios')

const mockTodos = [
  {
    id: { value: 1 },
    title: { value: 'テストTodo1' },
    person: { value: '担当者A' },
    done: { value: false },
  },
  {
    id: { value: 2 },
    title: { value: 'テストTodo2' },
    person: { value: '担当者B' },
    done: { value: true },
  },
]

describe('Todo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('fetchTodos', () => {
    it('成功時にtodosが正しくセットされること', async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: { todos: mockTodos } })

      const store = useTodoStore()
      const result = await store.fetchTodos()

      expect(result.isSuccess).toBe(true)
      expect(result.message).toBe('Todoの取得に成功しました')
      expect(store.todos).toHaveLength(2)
      expect(store.todos[0]).toEqual({ id: 1, title: 'テストTodo1', person: '担当者A', done: false })
      expect(store.todos[1]).toEqual({ id: 2, title: 'テストTodo2', person: '担当者B', done: true })
    })

    it('失敗時にエラーメッセージが返ること', async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error('Network Error'))

      const store = useTodoStore()
      const result = await store.fetchTodos()

      expect(result.isSuccess).toBe(false)
      expect(result.message).toBe('Todoの取得に失敗しました')
    })
  })

  describe('getTodos getter', () => {
    it('todosの一覧を返すこと', async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: { todos: mockTodos } })

      const store = useTodoStore()
      await store.fetchTodos()

      expect(store.getTodos).toHaveLength(2)
    })
  })

  describe('createTodo', () => {
    it('成功時に成功メッセージが返ること', async () => {
      vi.mocked(axios.post).mockResolvedValue({})

      const store = useTodoStore()
      const result = await store.createTodo({
        id: undefined,
        title: '新しいTodo',
        person: '担当者A',
        done: false,
      })

      expect(result.isSuccess).toBe(true)
      expect(result.message).toBe('Todoの登録に成功しました')
    })

    it('失敗時にエラーメッセージが返ること', async () => {
      vi.mocked(axios.post).mockRejectedValue(new Error('Network Error'))

      const store = useTodoStore()
      const result = await store.createTodo({
        id: undefined,
        title: '新しいTodo',
        person: '担当者A',
        done: false,
      })

      expect(result.isSuccess).toBe(false)
      expect(result.message).toBe('Todoの登録に失敗しました')
    })
  })

  describe('updateTodo', () => {
    it('成功時に成功メッセージが返ること', async () => {
      vi.mocked(axios.put).mockResolvedValue({})

      const store = useTodoStore()
      const result = await store.updateTodo({
        id: 1,
        title: '更新したTodo',
        person: '担当者B',
        done: true,
      })

      expect(result.isSuccess).toBe(true)
      expect(result.message).toBe('Todoの更新に成功しました')
    })

    it('失敗時にエラーメッセージが返ること', async () => {
      vi.mocked(axios.put).mockRejectedValue(new Error('Network Error'))

      const store = useTodoStore()
      const result = await store.updateTodo({
        id: 1,
        title: '更新したTodo',
        person: '担当者B',
        done: true,
      })

      expect(result.isSuccess).toBe(false)
      expect(result.message).toBe('Todoの更新に失敗しました')
    })
  })

  describe('deleteTodo', () => {
    it('成功時に成功メッセージが返ること', async () => {
      vi.mocked(axios.delete).mockResolvedValue({})

      const store = useTodoStore()
      const result = await store.deleteTodo(1)

      expect(result.isSuccess).toBe(true)
      expect(result.message).toBe('Todoの削除に成功しました')
    })

    it('失敗時にエラーメッセージが返ること', async () => {
      vi.mocked(axios.delete).mockRejectedValue(new Error('Network Error'))

      const store = useTodoStore()
      const result = await store.deleteTodo(1)

      expect(result.isSuccess).toBe(false)
      expect(result.message).toBe('Todoの削除に失敗しました')
    })
  })
})
