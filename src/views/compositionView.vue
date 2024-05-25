<template>
  <div>
    <v-container>
      <v-form v-model="validNewTodo">
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="newTodo"
              :rules="[required, limit_length]"
              counter="200"
              clearable
              label="TODOを入力"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-select :rules="[required]" label="担当者" v-model="pic" :items="pics"></v-select>
          </v-col>
          <v-col cols="2">
            <v-btn height="55" color="primary" @click="addTodo">
              <svg-icon type="mdi" :path="icons.mdiPlaylistEdit"></svg-icon>追加
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
    <TodoTableTitle
      title="In progress..."
      :todoList="todos"
      @clear-click="clearTodo($event, 'todos')"
      @move-click="moveTodo($event, 'todos')"
    />
    <v-data-table :headers="headers" :items="todos" items-per-page="5">
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.time }}</td>
          <td>
            <span v-if="item.onEditTodo">
              <v-form v-model="validEditTodo">
                <v-row class="align-center">
                  <v-col cols="9">
                    <v-text-field
                      v-model="item.content"
                      :rules="[required, limit_length]"
                      counter="200"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-btn @click="editFinish('todo', item)">編集完了</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </span>
            <span v-else>
              {{ item.content }}
              <v-btn @click="editStart('todo', item)">編集</v-btn>
            </span>
          </td>
          <td>
            <span v-if="item.onEditPerson">
              <v-row class="align-center">
                <v-col>
                  <v-select :rules="[required]" v-model="item.pic" :items="pics"></v-select>
                </v-col>
                <v-col>
                  <v-btn @click="editFinish('pic', item)">編集完了</v-btn>
                </v-col>
              </v-row>
            </span>
            <span v-else>
              {{ item.pic }}
              <v-btn @click="editStart('pic', item)">編集</v-btn>
            </span>
          </td>
          <td>
            <v-btn @click="deleteTodo(item)">
              <svg-icon type="mdi" :path="icons.mdiDelete"></svg-icon>削除
            </v-btn>
            <v-btn color="green-darken-1" @click="completeTodo(item)">
              <v-icon class="ma-2" start icon="mdi-checkbox-marked-circle"></v-icon>完了
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
    <TodoTableTitle
      title="Done!!"
      :todoList="completeTodos"
      @clear-click="clearTodo($event, 'completeTodos')"
      @move-click="moveTodo($event, 'completeTodos')"
    />
    <v-data-table :headers="headers" :items="completeTodos" items-per-page="5">
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.time }}</td>
          <td>{{ item.content }}</td>
          <td>{{ item.pic }}</td>
          <td>
            <v-btn color="orange-darken-2" @click="returnTodo(item)">
              <v-icon start icon="mdi-arrow-left"></v-icon>戻す
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { mdiDelete, mdiPlaylistEdit } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import TodoTableTitle from '../components/TodoTableTitle.vue'
import dayjs from 'dayjs'

interface Todo {
  id: number | null
  content: string
  pic: string
  time: string // dayjs.Dayjs
  onEditTodo: boolean
  onEditPerson: boolean
}

let todos = ref<Todo[]>([])
let completeTodos = ref<Todo[]>([])
let newTodo = ref<string>('')
let pic = ref<string>('')

const id = ref<number>(1)
const validNewTodo = ref(false)
const validEditTodo = ref(false)

const pics = ['担当者A', '担当者B', '担当者C']
const headers = [
  { title: 'Created_Date', value: 'time', width: '10%' },
  { title: 'Content', value: 'todo', width: '40%' },
  { title: 'Person', value: 'pic', width: '30%' },
  { title: 'Command', value: 'decide', width: '20%' },
]
const icons = {
  mdiDelete,
  mdiPlaylistEdit,
}

export default defineComponent({
  components: {
    SvgIcon,
    TodoTableTitle,
  },
  setup() {
    const addTodo = () => {
      if (!validNewTodo.value) return

      todos.value.push({
        id: id.value++,
        content: newTodo.value,
        pic: pic.value,
        time: getTime(),
        onEditTodo: false,
        onEditPerson: false,
      })
      newTodo.value = ''
      pic.value = ''
    }

    const deleteTodo = (todo: Todo) => {
      const index = todos.value.indexOf(todo)
      todos.value.splice(index, 1)
    }

    const completeTodo = (todo: Todo) => {
      const index = todos.value.indexOf(todo)
      if (todos.value[index].onEditTodo) return

      completeTodos.value.push(todo)
      deleteTodo(todo)
    }

    const returnTodo = (todo: Todo) => {
      todos.value.push(todo)
      const index = completeTodos.value.indexOf(todo)
      completeTodos.value.splice(index, 1)
    }

    const clearTodo = (emptyTodos: Todo[], target: string) => {
      if (target === 'todos') {
        todos.value = emptyTodos
      } else {
        completeTodos.value = emptyTodos
      }
    }

    const moveTodo = (list: Todo[], target: string) => {
      if (target === 'todos') {
        if (list.some((item) => item.onEditTodo)) return

        completeTodos.value.push(...list)
        todos.value.splice(0)
      } else {
        todos.value.push(...list)
        completeTodos.value.splice(0)
      }
    }

    const getTime = () => {
      return dayjs().format('YYYY-MM-DD HH:mm')
    }

    const editStart = (editTarget: string, todo: Todo) => {
      const index = todos.value.indexOf(todo)
      if (editTarget === 'todo') {
        todos.value[index].onEditTodo = true
      } else {
        todos.value[index].onEditPerson = true
      }
    }

    const editFinish = (editTarget: string, todo: Todo) => {
      const index = todos.value.indexOf(todo)
      if (editTarget === 'todo') {
        if (!validEditTodo.value) return

        todos.value[index].onEditTodo = false
      } else {
        todos.value[index].onEditPerson = false
      }
    }

    const required = (value: string) => !!value || '必ず入力してください'
    const limit_length = (value: string) => value.length <= 200 || '200文字以内で入力してください'

    return {
      newTodo,
      pics,
      pic,
      headers,
      icons,
      todos,
      completeTodos,
      addTodo,
      completeTodo,
      editStart,
      editFinish,
      deleteTodo,
      returnTodo,
      moveTodo,
      clearTodo,
      required,
      limit_length,
      validNewTodo,
      validEditTodo,
    }
  },
})
</script>
