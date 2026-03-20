import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '../counter'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('初期値が0であること', () => {
    const store = useCounterStore()
    expect(store.count).toBe(0)
  })

  it('incrementを呼ぶとcountが1増えること', () => {
    const store = useCounterStore()
    store.increment()
    expect(store.count).toBe(1)
  })

  it('incrementを複数回呼ぶとcountが正しく増加すること', () => {
    const store = useCounterStore()
    store.increment()
    store.increment()
    store.increment()
    expect(store.count).toBe(3)
  })

  it('doubleCountがcountの2倍であること', () => {
    const store = useCounterStore()
    store.increment()
    store.increment()
    expect(store.doubleCount).toBe(4)
  })

  it('count=0のとき doubleCountが0であること', () => {
    const store = useCounterStore()
    expect(store.doubleCount).toBe(0)
  })
})
