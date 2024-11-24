<template>
  <div>
    <loading v-model:active="isLoading" :enforce-focus="false" />
    <v-alert v-if="alert.visible" density="compact" :type="alert.type">{{ alert.message }}</v-alert>
    <v-dialog v-model="userRegistDialog" max-width="600" persistent>
      <v-form ref="validUserForm">
        <v-sheet class="ma-5">
          <v-container>
            <v-row
              class="ml-4 text-red-darken-4 font-weight-bold"
              v-for="message in messages"
              :key="message"
              >{{ message }}</v-row
            >
            <v-row>
              <v-col class="mx-4">
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
      <v-form ref="validForm">
        <v-row>
          <v-col cols="6">
            <!-- 引数指定しないとlinterエラー。暫定でundefinedを指定。 -->
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
      <v-form ref="validEditForm">
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
import { ref, onMounted, watch } from 'vue'
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

interface Alert {
  visible: boolean
  type: string
  message: string
}

interface ResponseResult {
  isSuccess: boolean
  message: string
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
// Promiseの<>指定がわからず、linterエラー出るため暫定対応
const validForm = ref<any>({})
const validUserForm = ref<any>({})
const validEditForm = ref<any>({})

let userRegistDialog = ref<boolean>(false)
let editTodoDialog = ref<boolean>(false)
let isLoading = ref<boolean>(false)
let alert = ref<Alert>({
  visible: false,
  type: '',
  message: '',
})

let pics = ref<string[]>([])

const todoHeader = [
  { title: 'ID', value: 'id', width: '5%', sortable: true },
  { title: 'Title', value: 'title', width: '35%', sortable: true },
  { title: 'Person', value: 'person', width: '20%', sortable: true },
  { title: 'Status', value: 'done', width: '15%', sortable: true },
  { title: 'Action', value: 'action', width: '25%', sortable: false },
]
const sortByStatus = [{ key: 'done', order: 'asc' }]
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

watch(alert, () => {
  if (alert.value.visible) {
    setTimeout(() => {
      alert.value.visible = false
    }, 10000)
  }
})

const displayError = (result: ResponseResult) => {
  if (result.isSuccess) return false

  alert.value = {
    visible: true,
    type: 'error',
    message: result.message,
  }
  return true
}

const displaySuccess = (result: ResponseResult) => {
  if (!result.isSuccess) return false

  alert.value = {
    visible: true,
    type: 'success',
    message: result.message,
  }
  return true
}

const initialize = async () => {
  const responseTodos = await todoStore.fetchTodos()
  if (displayError(responseTodos)) return
  if (todoStore.todos.length === 0) return

  const responseUsers = await userStore.fetchUsers()
  if (displayError(responseUsers)) return
  if (userStore.users.length === 0) return
  pics.value = userStore.users.map((user: User) => user.name)
}

const userValidate = async () => {
  const validResult = await validUserForm.value.validate()
  if (!validResult.valid) {
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
  const { valid } = await userValidate()
  if (!valid) return

  const payload = {
    id: undefined,
    name: user.value.name,
    email: user.value.email,
    phone_number: user.value.phoneNumber,
  }

  isLoading.value = true
  const responseResult = await userStore.registUser(payload)
  responseResult.isSuccess ? displaySuccess(responseResult) : displayError(responseResult)
  initialize().then(() => {
    isLoading.value = false
    validUserForm.value.reset()
  })
}
const addTodo = async () => {
  const { valid } = await validForm.value.validate()
  if (!valid) return
  const payload = {
    id: undefined,
    title: todo.value,
    person: pic.value,
    done: false,
  }

  isLoading.value = true
  const responseResult = await todoStore.createTodo(payload)
  responseResult.isSuccess ? displaySuccess(responseResult) : displayError(responseResult)
  initialize().then(() => {
    isLoading.value = false
    validForm.value.reset()
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
  const responseResult = await todoStore.updateTodo(payload)
  responseResult.isSuccess ? displaySuccess(responseResult) : displayError(responseResult)
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
  const { valid } = await validEditForm.value.validate()
  if (!valid) return
  const payload = {
    id: editedItem.value.id,
    title: editedItem.value.title,
    person: editedItem.value.person,
    done: editedItem.value.done,
  }

  isLoading.value = true
  const responseResult = await todoStore.updateTodo(payload)
  responseResult.isSuccess ? displaySuccess(responseResult) : displayError(responseResult)
  initialize().then(() => {
    isLoading.value = false
    validEditForm.value.reset()
  })
  editTodoDialog.value = false
}
const deleteTodo = async (item: Todo) => {
  isLoading.value = true

  const responseResult = await todoStore.deleteTodo(item.id)
  responseResult.isSuccess ? displaySuccess(responseResult) : displayError(responseResult)
  initialize().then(() => {
    isLoading.value = false
  })
}
</script>
