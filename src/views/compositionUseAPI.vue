<template>
  <div>
    <loading v-model:active="isLoading" :enforce-focus="false" />
    <v-container>
      <v-form v-model="validForm">
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="todo"
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
            <v-btn height="55" color="primary" @click="addTodo()">
              <svg-icon type="mdi" :path="icons.mdiPlaylistPlus"></svg-icon>追加
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
      <v-data-table :headers="todoHeader" :items="todos" :sort-by="sortByStatus" hover>
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
    <v-dialog v-model="dialog" max-width="600">
      <v-form v-model="validEditForm">
        <v-sheet class="ma-5">
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="editedItem.title"
                  :rules="[required, limit_length]"
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
                  :rules="[required]"
                  label="担当者"
                  v-model="editedItem.person"
                  :items="pics"
                ></v-select>
              </v-col>
            </v-row>
            <v-row justify="end">
              <v-btn variant="outlined" color="primary" @click="dialog = false" class="pa-1 mr-2"
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

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'
import {
  mdiDelete,
  mdiPlaylistEdit,
  mdiPlaylistPlus,
  mdiChevronDoubleDown,
  mdiChevronDoubleUp,
  mdiCheckboxMarkedOutline,
  mdiWalk,
} from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

interface Todo {
  id: number
  title: string
  person: string
  done: boolean
}

let todos = ref<Todo[]>([])
let todo = ref<string>('')
let pic = ref<string>('')
let dialog = ref(false)
let isLoading = ref(false)
let res = ref<Todo[] | null>([])
let editedItem = ref<Todo>({
  id: null,
  title: '',
  person: '',
  done: false,
})
const validForm = ref(false)
const validEditForm = ref(false)

const todoHeader = [
  { title: 'ID', value: 'id', width: '5%', sortable: true },
  { title: 'Title', value: 'title', width: '35%', sortable: true },
  { title: 'Person', value: 'person', width: '20%', sortable: true },
  { title: 'Status', value: 'done', width: '15%', sortable: true },
  { title: 'Action', value: 'action', width: '25%', sortable: false },
]
const sortByStatus = [{ key: 'done', order: 'asc' }]
const pics = ['担当者A', '担当者B', '担当者C']
const icons = {
  mdiDelete,
  mdiPlaylistEdit,
  mdiPlaylistPlus,
  mdiChevronDoubleDown,
  mdiChevronDoubleUp,
  mdiCheckboxMarkedOutline,
  mdiWalk,
}
export default defineComponent({
  components: {
    Loading,
    SvgIcon,
  },

  //   created() {
  //     this.isLoading = true
  //     this.initialize().then(() => {
  //       this.isLoading = false
  //     })
  //   },
  setup() {
    onMounted(() => {
      isLoading.value = true
      initialize().then(() => {
        isLoading.value = false
      })
    })

    const required = (value) => !!value || '必ず入力してください'
    const limit_length = (value) => value.length <= 200 || '200文字以内で入力してください'

    const initialize = async () => {
      todos.value = []
      await axios
        .get('http://localhost:8080/v1/todos')
        .then((response) => (res.value = response.data.todos))
        .catch((error) => console.log(error))
      if (!res.value) return

      res.value.forEach((res) =>
        todos.value.push({
          id: res.id.value,
          title: res.title.value,
          person: res.person.value,
          done: res.done.value,
        })
      )
    }
    const addTodo = async () => {
      if (!validForm.value) return

      isLoading.value = true
      await axios
        .post('http://localhost:8080/v1/todos', {
          title: todo.value,
          person: pic.value,
          done: false,
        })
        .then((response) => console.log(response.data))
        .catch((error) => {
          console.log(error)
          isLoading.value = false
        })

      initialize().then(() => {
        isLoading.value = false
      })
    }
    const changeStatus = async (item) => {
      isLoading.value = true
      const done = item.done ? false : true
      await axios
        .put(`http://localhost:8080/v1/todos/${item.id}`, {
          title: item.title,
          person: item.person,
          done: done,
        })
        .then((response) => console.log(response.data))
        .catch((error) => {
          console.log(error)
          isLoading.value = false
        })

      initialize().then(() => {
        isLoading.value = false
      })
    }
    const editItem = (item) => {
      editedItem.value = {
        id: item.id,
        title: item.title,
        person: item.person,
        done: item.done,
      }
      dialog.value = true
    }
    const editSave = async () => {
      if (!validEditForm.value) return

      isLoading.value = true
      await axios
        .put(`http://localhost:8080/v1/todos/${editedItem.value.id}`, {
          title: editedItem.value.title,
          person: editedItem.value.person,
          done: editedItem.value.done,
        })
        .then((response) => console.log(response.data))
        .catch((error) => {
          console.log(error)
          isLoading.value = false
        })

      initialize().then(() => {
        isLoading.value = false
      })
      dialog.value = false
    }
    const deleteTodo = async (item) => {
      isLoading.value = true
      await axios
        .delete(`http://localhost:8080/v1/todos/${item.id}`)
        .then((response) => console.log(response.data))
        .catch((error) => {
          console.log(error)
          isLoading.value = false
        })

      initialize().then(() => {
        isLoading.value = false
      })
    }

    return {
      todo,
      todos,
      pic,
      dialog,
      isLoading,
      res,
      editedItem,
      pics,
      todoHeader,
      sortByStatus,
      icons,
      initialize,
      addTodo,
      editItem,
      editSave,
      deleteTodo,
      changeStatus,
      required,
      limit_length,
      validForm,
      validEditForm,
    }
  },
})
</script>
