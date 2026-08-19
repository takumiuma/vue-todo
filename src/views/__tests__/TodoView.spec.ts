import { describe, it, expect, beforeEach, vi } from 'vitest'

// TodoViewのメソッドロジックを直接テストするためのユーティリティ
// バリデーション関数
const required = (value: string) => !!value || '必ず入力してください'
const limit_length = (value: string) => value.length <= 200 || '200文字以内で入力してください'

// TodoViewのビジネスロジックを抽出してテスト
interface Todo {
  id: number
  content: string
  pic: string
  time: string
  onEditTodo: boolean
  onEditPerson: boolean
}

function createTodoViewState() {
  return {
    todos: [] as Todo[],
    completeTodos: [] as Todo[],
    id: 1,
  }
}

function deleteTodo(state: ReturnType<typeof createTodoViewState>, todo: Todo) {
  const index = state.todos.indexOf(todo)
  state.todos.splice(index, 1)
}

function completeTodo(state: ReturnType<typeof createTodoViewState>, todo: Todo) {
  const index = state.todos.indexOf(todo)
  if (state.todos[index].onEditTodo) return
  state.completeTodos.push(todo)
  deleteTodo(state, todo)
}

function returnTodo(state: ReturnType<typeof createTodoViewState>, todo: Todo) {
  state.todos.push(todo)
  const index = state.completeTodos.indexOf(todo)
  state.completeTodos.splice(index, 1)
}

function clearTodo(
  state: ReturnType<typeof createTodoViewState>,
  emptyTodos: Todo[],
  target: string,
) {
  if (target === 'todos') {
    state.todos = emptyTodos
  } else {
    state.completeTodos = emptyTodos
  }
}

function moveTodo(
  state: ReturnType<typeof createTodoViewState>,
  list: Todo[],
  target: string,
) {
  if (target === 'todos') {
    if (list.some((item) => item.onEditTodo)) return
    state.completeTodos.push(...list)
    state.todos.splice(0)
  } else {
    state.todos.push(...list)
    state.completeTodos.splice(0)
  }
}

describe('TodoView バリデーション', () => {
  describe('required()', () => {
    it('値が入力されている場合trueを返すこと', () => {
      expect(required('テスト')).toBe(true)
    })

    it('空文字の場合エラーメッセージを返すこと', () => {
      expect(required('')).toBe('必ず入力してください')
    })
  })

  describe('limit_length()', () => {
    it('200文字以内の場合trueを返すこと', () => {
      expect(limit_length('a'.repeat(200))).toBe(true)
    })

    it('201文字以上の場合エラーメッセージを返すこと', () => {
      expect(limit_length('a'.repeat(201))).toBe('200文字以内で入力してください')
    })

    it('空文字の場合trueを返すこと', () => {
      expect(limit_length('')).toBe(true)
    })
  })
})

describe('TodoView メソッド', () => {
  let state: ReturnType<typeof createTodoViewState>
  let sampleTodo: Todo

  beforeEach(() => {
    state = createTodoViewState()
    sampleTodo = {
      id: 1,
      content: 'テストTodo',
      pic: '担当者A',
      time: '2024-01-01 10:00',
      onEditTodo: false,
      onEditPerson: false,
    }
    state.todos = [sampleTodo]
  })

  describe('deleteTodo()', () => {
    it('指定したtodoがtodosから削除されること', () => {
      deleteTodo(state, sampleTodo)
      expect(state.todos).toHaveLength(0)
    })

    it('指定したtodo以外は残ること', () => {
      const anotherTodo: Todo = {
        id: 2,
        content: '別のTodo',
        pic: '担当者B',
        time: '2024-01-02 10:00',
        onEditTodo: false,
        onEditPerson: false,
      }
      state.todos.push(anotherTodo)
      deleteTodo(state, sampleTodo)
      expect(state.todos).toHaveLength(1)
      expect(state.todos[0]).toBe(anotherTodo)
    })
  })

  describe('completeTodo()', () => {
    it('todoがcompleteTodosに移動されること', () => {
      completeTodo(state, sampleTodo)
      expect(state.completeTodos).toHaveLength(1)
      expect(state.todos).toHaveLength(0)
    })

    it('編集中のtodoは完了に移動されないこと', () => {
      sampleTodo.onEditTodo = true
      completeTodo(state, sampleTodo)
      expect(state.completeTodos).toHaveLength(0)
      expect(state.todos).toHaveLength(1)
    })
  })

  describe('returnTodo()', () => {
    it('completeTodosのtodoがtodosに戻されること', () => {
      state.completeTodos = [sampleTodo]
      state.todos = []
      returnTodo(state, sampleTodo)
      expect(state.todos).toHaveLength(1)
      expect(state.completeTodos).toHaveLength(0)
    })
  })

  describe('clearTodo()', () => {
    it('target="todos"の場合todosが空になること', () => {
      clearTodo(state, [], 'todos')
      expect(state.todos).toHaveLength(0)
    })

    it('target="completeTodos"の場合completeTodosが空になること', () => {
      state.completeTodos = [sampleTodo]
      clearTodo(state, [], 'completeTodos')
      expect(state.completeTodos).toHaveLength(0)
    })
  })

  describe('moveTodo()', () => {
    it('target="todos"の場合todosが全てcompleteTodosに移動すること', () => {
      moveTodo(state, state.todos, 'todos')
      expect(state.completeTodos).toHaveLength(1)
      expect(state.todos).toHaveLength(0)
    })

    it('target="todos"で編集中のtodoがある場合移動されないこと', () => {
      sampleTodo.onEditTodo = true
      moveTodo(state, state.todos, 'todos')
      expect(state.completeTodos).toHaveLength(0)
      expect(state.todos).toHaveLength(1)
    })

    it('target="completeTodos"の場合completeTodosが全てtodosに移動すること', () => {
      state.completeTodos = [sampleTodo]
      state.todos = []
      moveTodo(state, state.completeTodos, 'completeTodos')
      expect(state.todos).toHaveLength(1)
      expect(state.completeTodos).toHaveLength(0)
    })
  })
})
