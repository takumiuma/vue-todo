import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import axios from 'axios'
import { useUserStore } from '../use-user-store'

vi.mock('axios')

const mockUsers = [
  {
    id: { value: 1 },
    name: { value: '山田太郎' },
    email: { value: 'yamada@example.com' },
    phone_number: { value: true },
  },
  {
    id: { value: 2 },
    name: { value: '鈴木花子' },
    email: { value: 'suzuki@example.com' },
    phone_number: { value: false },
  },
]

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('fetchUsers', () => {
    it('成功時にusersが正しくセットされること', async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: { users: mockUsers } })

      const store = useUserStore()
      const result = await store.fetchUsers()

      expect(result.isSuccess).toBe(true)
      expect(result.message).toBe('利用者の取得に成功しました')
      expect(store.users).toHaveLength(2)
      expect(store.users[0]).toEqual({
        id: 1,
        name: '山田太郎',
        email: 'yamada@example.com',
        phone_number: true,
      })
      expect(store.users[1]).toEqual({
        id: 2,
        name: '鈴木花子',
        email: 'suzuki@example.com',
        phone_number: false,
      })
    })

    it('失敗時にエラーメッセージが返ること', async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error('Network Error'))

      const store = useUserStore()
      const result = await store.fetchUsers()

      expect(result.isSuccess).toBe(false)
      expect(result.message).toBe('利用者を取得に失敗しました')
    })
  })

  describe('registUser', () => {
    it('成功時に成功メッセージが返ること', async () => {
      vi.mocked(axios.post).mockResolvedValue({})

      const store = useUserStore()
      const result = await store.registUser({
        id: undefined,
        name: '新しい利用者',
        email: 'new@example.com',
        phone_number: '090-1234-5678',
      })

      expect(result.isSuccess).toBe(true)
      expect(result.message).toBe('利用者の登録に成功しました')
    })

    it('失敗時にエラーメッセージが返ること', async () => {
      vi.mocked(axios.post).mockRejectedValue(new Error('Network Error'))

      const store = useUserStore()
      const result = await store.registUser({
        id: undefined,
        name: '新しい利用者',
        email: 'new@example.com',
        phone_number: '090-1234-5678',
      })

      expect(result.isSuccess).toBe(false)
      expect(result.message).toBe('利用者の登録に失敗しました')
    })
  })
})
