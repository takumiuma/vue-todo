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

interface RequestUser {
  id: number | undefined
  name: string
  email: string
  phone_number: string
}

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
          return { isSuccess: true, message: '利用者の取得に成功しました' }
        })
        .catch(() => {
          return { isSuccess: false, message: '利用者を取得に失敗しました' }
        })
    },
    async registUser(payload: RequestUser) {
      return await axios
        .post(`${apiUrl}/v1/users`, payload)
        .then(() => {
          return { isSuccess: true, message: '利用者の登録に成功しました' }
        })
        .catch(() => {
          return { isSuccess: false, message: '利用者の登録に失敗しました' }
        })
    },
  },
})
