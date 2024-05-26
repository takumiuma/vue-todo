import axios from 'axios'
import { defineStore } from 'pinia'

const apiUrl = 'http://localhost:8080'

// interface User {
//   id: number | null
//   name: string
//   email: string
//   phone_number: boolean
// }

interface ResponseUser {
  id: { value: number | null }
  name: { value: string }
  email: { value: string }
  phone_number: { value: boolean }
}

// interface RequestUser {
//   id: number | undefined
//   title: string
//   person: string
//   done: boolean
// }

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
  }),
  actions: {
    async fetchUsers() {
      return await axios
        .get(`${apiUrl}/v1/users`)
        .then((response) => {
          const tmpUsers = response.data.users
          this.users = tmpUsers.map((todo: ResponseUser) => {
            return {
              id: todo.id.value,
              name: todo.name.value,
              email: todo.email.value,
              phone_number: todo.phone_number.value,
            }
          })
        })
        .catch((error) => console.log(error))
    },
    // async registUser(payload: RequestTodo) {
    //   return await axios
    //     .post(`${apiUrl}/v1/todos`, payload)
    //     .then((response) => console.log(response.data))
    //     .catch((error) => {
    //       console.log(error)
    //     })
    // },
  },
})
