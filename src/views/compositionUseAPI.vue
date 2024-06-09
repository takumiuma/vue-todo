<template>
  <div>
    <loading v-model:active="isLoading" :enforce-focus="false" />
    <v-dialog v-model="userRegistDialog" max-width="600" persistent>
      <v-form ref="validUserForm">
        <v-sheet class="ma-5">
          <v-container>
            <v-row v-for="message in messages" :key="message">{{ message }}</v-row>
            <v-row>
              <v-col class="mx-4">
                <!-- 引数指定しないとlinterエラー。暫定でundefinedを指定。 -->
                <v-text-field
                  v-model="user.name"
                  :rules="[required('氏名'), limit_length(20, '氏名')]"
                  counter="20"
                  clearable
                  label="氏名"
                  hide-details
                  @blur="userValidate"
                  @update:model-value="userValidate"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="mx-4">
                <v-text-field
                  v-model="user.email"
                  :rules="[required('メールアドレス'), limit_length(30, 'メールアドレス')]"
                  counter="30"
                  clearable
                  label="メールアドレス"
                  hide-details
                  @blur="userValidate"
                  @update:model-value="userValidate"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="mx-4">
                <v-text-field
                  v-model="user.phoneNumber"
                  :rules="[required('電話番号'), limit_length(11, '電話番号')]"
                  counter="11"
                  clearable
                  label="電話番号"
                  hide-details
                  @blur="userValidate"
                  @update:model-value="userValidate"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row justify="end">
              <div>
                <v-col>
                  <v-btn
                    variant="outlined"
                    color="primary"
                    @click="(userRegistDialog = false), validUserForm.reset()"
                    class="pa-1 mr-2"
                    >キャンセル</v-btn
                  >
                  <v-btn color="primary" @click="execRegistUser()">保存</v-btn>
                </v-col>
              </div>
            </v-row>
          </v-container>
        </v-sheet>
      </v-form>
    </v-dialog>
    <v-container>
      <v-form v-model="validForm">
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="todo"
              :rules="[required(undefined), limit_length(200, undefined)]"
              counter="200"
              clearable
              label="TODOを入力"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select
              :rules="[required(undefined)]"
              label="担当者"
              v-model="pic"
              :items="pics"
            ></v-select>
          </v-col>
          <v-col cols="3">
            <v-btn height="40px" size="small" color="primary" @click="addTodo()">
              <svg-icon type="mdi" :path="icons.mdiPlaylistPlus"></svg-icon>追加
            </v-btn>
            <v-btn
              class="ml-2"
              height="40px"
              size="small"
              color="primary"
              variant="outlined"
              @click="userRegistDialog = true"
            >
              <svg-icon type="mdi" :path="icons.mdiAccountPlus"></svg-icon>担当者登録
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
      <v-data-table :headers="todoHeader" :items="todoStore.todos" :sort-by="sortByStatus" hover>
        <template #item="{ item }">
          <tr>
            <td>{{ item.id }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.person }}</td>
            <td>
              <v-row>
                {{ item.done ? 'Done' : 'In progress' }}
                <span v-if="!item.done">
                  <svg-icon type="mdi" :path="icons.mdiWalk"></svg-icon>
                </span>
                <span v-if="item.done">
                  <svg-icon type="mdi" :path="icons.mdiCheckboxMarkedOutline"></svg-icon>
                </span>
              </v-row>
            </td>
            <td>
              <span v-if="!item.done">
                <v-btn @click="changeStatus(item)" size="small">
                  <svg-icon type="mdi" :path="icons.mdiChevronDoubleDown"></svg-icon>完了
                </v-btn>
              </span>
              <span v-if="item.done">
                <v-btn @click="changeStatus(item)" size="small">
                  <svg-icon type="mdi" :path="icons.mdiChevronDoubleUp"></svg-icon>仕掛
                </v-btn>
              </span>
              <v-btn @click="editItem(item)" class="ma-2" size="small">
                <svg-icon type="mdi" :path="icons.mdiPlaylistEdit"></svg-icon>
              </v-btn>
              <v-btn @click="deleteTodo(item)" class="ma-2" size="small">
                <svg-icon type="mdi" :path="icons.mdiDelete"></svg-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-container>
    <v-dialog v-model="editTodoDialog" max-width="600" persistent>
      <v-form v-model="validEditForm">
        <v-sheet class="ma-5">
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="editedItem.title"
                  :rules="[required(undefined), limit_length(200, undefined)]"
                  counter="200"
                  clearable
                  label="TODOを入力"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-select
                  :rules="[required(undefined)]"
                  label="担当者"
                  v-model="editedItem.person"
                  :items="pics"
                ></v-select>
              </v-col>
            </v-row>
            <v-row justify="end">
              <v-btn
                variant="outlined"
                color="primary"
                @click="editTodoDialog = false"
                class="pa-1 mr-2"
                >キャンセル</v-btn
              >
              <v-btn color="primary" @click="editSave()">保存</v-btn>
            </v-row>
          </v-container>
        </v-sheet>
      </v-form>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  mdiDelete,
  mdiPlaylistEdit,
  mdiPlaylistPlus,
  mdiChevronDoubleDown,
  mdiChevronDoubleUp,
  mdiCheckboxMarkedOutline,
  mdiWalk,
  mdiAccountPlus,
} from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { useTodoStore } from '../store/use-todo-store.ts'
import { useUserStore } from '../store/use-user-store.ts'

interface Todo {
  id: number
  title: string
  person: string
  done: boolean
}

interface User {
  id: number | undefined
  name: string
  email: string
  phoneNumber: string
}

let user = ref<User>({
  id: undefined,
  name: '',
  email: '',
  phoneNumber: '',
})
let todo = ref<string>('')
let pic = ref<string>('')
let editedItem = ref<Todo>({
  id: 0,
  title: '',
  person: '',
  done: false,
})

const messages = ref<string[]>([])
const validForm = ref<boolean>(false)
const validUserForm = ref<any>({}) // Promiseの初期値がわからず、linterエラー出るため暫定対応
const validEditForm = ref<boolean>(false)
let userRegistDialog = ref<boolean>(false)
let editTodoDialog = ref<boolean>(false)
let isLoading = ref<boolean>(false)

let pics = ref<string[]>([])

const todoHeader = [
  { title: 'ID', value: 'id', width: '5%', sortable: true },
  { title: 'Title', value: 'title', width: '35%', sortable: true },
  { title: 'Person', value: 'person', width: '20%', sortable: true },
  { title: 'Status', value: 'done', width: '15%', sortable: true },
  { title: 'Action', value: 'action', width: '25%', sortable: false },
]
const sortByStatus = [{ key: 'done', order: 'asc' }]
// const pics = ['担当者A', '担当者B', '担当者C']
const icons = {
  mdiDelete,
  mdiPlaylistEdit,
  mdiPlaylistPlus,
  mdiChevronDoubleDown,
  mdiChevronDoubleUp,
  mdiCheckboxMarkedOutline,
  mdiWalk,
  mdiAccountPlus,
}

const todoStore = useTodoStore()
const userStore = useUserStore()

onMounted(() => {
  isLoading.value = true
  initialize().then(() => {
    isLoading.value = false
  })
})

const required = (label: string | undefined) => (value: string) =>
  !!value || (label ? `${label}は必ず入力してください` : '必ず入力してください')
const limit_length = (max: number, label: string | undefined) => (value: string) =>
  value.length <= max ||
  (label ? `${label}は${max}文字以内で入力してください` : `${max}文字以内で入力してください`)

const initialize = async () => {
  const responseTodos = await todoStore.fetchTodos()
  // TODO:responseから通信成功チェック
  if (todoStore.todos.length === 0) return

  const responseUsers = await userStore.fetchUsers()
  // TODO:responseから通信成功チェック
  if (userStore.users.length === 0) return
  pics.value = userStore.users.map((user: User) => user.name)
}

const userValidate = async () => {
  const validResult = await validUserForm.value.validate()
  if (!validResult.valid) {
    console.log(validResult.errors)
    messages.value = validResult.errors.map((err: { errorMessages: string[] }) =>
      err.errorMessages
        .map((errMsg: string) => errMsg)
        .join(',')
        .replace(',', '\n')
    )
    return validResult
  }
  messages.value = []
  return validResult
}
const execRegistUser = async () => {
  const isValid = await userValidate()
  if (!isValid) return

  const payload = {
    id: undefined,
    name: user.value.name,
    email: user.value.email,
    phone_number: user.value.phoneNumber,
  }

  isLoading.value = true
  const response = await userStore.registUser(payload)
  // TODO:responseから通信成功チェック
  initialize().then(() => {
    isLoading.value = false
    validUserForm.value.reset()
  })
}
const addTodo = async () => {
  if (!validForm.value) return
  const payload = {
    id: undefined,
    title: todo.value,
    person: pic.value,
    done: false,
  }

  isLoading.value = true
  const response = await todoStore.createTodo(payload)
  // TODO:responseから通信成功チェック
  initialize().then(() => {
    isLoading.value = false
    // TODO:テキストクリア
  })
}
const changeStatus = async (item: Todo) => {
  const payload = {
    id: item.id,
    title: item.title,
    person: item.person,
    done: item.done ? false : true,
  }

  isLoading.value = true
  const response = await todoStore.updateTodo(payload)
  // TODO:responseから通信成功チェック
  initialize().then(() => {
    isLoading.value = false
  })
}
const editItem = (item: Todo) => {
  editedItem.value = {
    id: item.id,
    title: item.title,
    person: item.person,
    done: item.done,
  }
  editTodoDialog.value = true
}
const editSave = async () => {
  if (!validEditForm.value) return
  const payload = {
    id: editedItem.value.id,
    title: editedItem.value.title,
    person: editedItem.value.person,
    done: editedItem.value.done,
  }

  isLoading.value = true
  const response = await todoStore.updateTodo(payload)
  // TODO:responseから通信成功チェック
  initialize().then(() => {
    isLoading.value = false
  })
  editTodoDialog.value = false
}
const deleteTodo = async (item: Todo) => {
  isLoading.value = true

  const response = await todoStore.deleteTodo(item.id)
  // TODO:responseから通信成功チェック
  initialize().then(() => {
    isLoading.value = false
  })
}
</script>
