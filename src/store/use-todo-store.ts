import axios from 'axios'
import { defineStore } from 'pinia'

const apiUrl = 'http://localhost:8080'

interface Todo {
  id: number | null
  title: string
  person: string
  done: boolean
}

interface ResponseTodo {
  id: { value: number | null }
  title: { value: string }
  person: { value: string }
  done: { value: boolean }
}

interface RequestTodo {
  id: number | undefined
  title: string
  person: string
  done: boolean
}
export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [],
  }),
  getters: {
    getTodos(): Todo[] {
      return this.todos
    },
  },
  actions: {
    async fetchTodos() {
      return await axios
        .get(`${apiUrl}/v1/todos`)
        .then((response) => {
          const tmpTodos = response.data.todos
          this.todos = tmpTodos.map((todo: ResponseTodo) => {
            return {
              id: todo.id.value,
              title: todo.title.value,
              person: todo.person.value,
              done: todo.done.value,
            }
          })
          return { isSuccess: true, message: 'Todoの取得に成功しました' }
        })
        .catch(() => {
          return { isSuccess: false, message: 'Todoの取得に失敗しました' }
        })
    },
    async createTodo(payload: RequestTodo) {
      return await axios
        .post(`${apiUrl}/v1/todos`, payload)
        .then(() => {
          return { isSuccess: true, message: 'Todoの登録に成功しました' }
        })
        .catch(() => {
          return { isSuccess: false, message: 'Todoの登録に失敗しました' }
        })
    },
    async updateTodo(payload: RequestTodo) {
      return await axios
        .put(`${apiUrl}/v1/todos/${payload.id}`, payload)
        .then(() => {
          return { isSuccess: true, message: 'Todoの更新に成功しました' }
        })
        .catch(() => {
          return { isSuccess: false, message: 'Todoの更新に失敗しました' }
        })
    },
    async deleteTodo(id: number) {
      return await axios
        .delete(`${apiUrl}/v1/todos/${id}`)
        .then(() => {
          return { isSuccess: true, message: 'Todoの削除に成功しました' }
        })
        .catch(() => {
          return { isSuccess: false, message: 'Todoの削除に失敗しました' }
        })
    },
  },
})
