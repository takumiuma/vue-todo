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
        })
        .catch((error) => console.log(error))
    },
    async createTodo(payload: RequestTodo) {
      return await axios
        .post(`${apiUrl}/v1/todos`, payload)
        .then((response) => console.log(response.data))
        .catch((error) => {
          console.log(error)
        })
    },
    async updateTodo(payload: RequestTodo) {
      return await axios
        .put(`${apiUrl}/v1/todos/${payload.id}`, payload)
        .then((response) => console.log(response.data))
        .catch((error) => {
          console.log(error)
        })
    },
    async deleteTodo(id: number) {
      return await axios
        .delete(`${apiUrl}/v1/todos/${id}`)
        .then((response) => console.log(response.data))
        .catch((error) => {
          console.log(error)
        })
    },
  },
})
