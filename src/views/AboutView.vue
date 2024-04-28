<template>
  <div class="about">
    <loading v-model:active="isLoading" :enforce-focus="false" />
    <h1>This is an about page</h1>
    <v-container>
      <v-form ref="form">
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
      <v-data-table :headers="todoHeader" :items="todos" hover>
        <template #item="{ item }">
          <tr>
            <td>{{ item.id }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.person }}</td>
            <td>{{ item.done ? 'Done' : 'In progress' }}</td>
            <td>
              <v-btn @click="changeStatus(item)" size="small">
                <svg-icon type="mdi" :path="icons.mdiChevronDoubleDown"></svg-icon>完了
              </v-btn>
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
      <v-form ref="editForm">
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
  <v-btn @click="check()">チェック</v-btn>
</template>

<script>
import axios from 'axios'
import { mdiDelete, mdiPlaylistEdit, mdiPlaylistPlus, mdiChevronDoubleDown } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

export default {
  components: {
    Loading,
    SvgIcon,
  },
  data() {
    return {
      dialog: false,
      isLoading: false,
      res: null,
      todo: '',
      editedItem: {
        id: null,
        title: '',
        person: '',
      },
      todos: [],
      todoHeader: [
        { title: 'ID', value: 'id', width: '5%' },
        { title: 'Title', value: 'title', width: '40%' },
        { title: 'Person', value: 'person', width: '20%' },
        { title: 'Status', value: 'done', width: '10%' },
        { title: 'Action', value: 'action', width: '25%' },
      ],
      pics: ['担当者A', '担当者B', '担当者C'],
      pic: '',
      icons: {
        mdiDelete,
        mdiPlaylistEdit,
        mdiPlaylistPlus,
        mdiChevronDoubleDown,
      },
    }
  },
  created() {
    this.isLoading = true
    this.initialize().then(() => {
      this.isLoading = false
    })
  },
  methods: {
    required: (value) => !!value || '必ず入力してください',
    limit_length: (value) => value.length <= 200 || '200文字以内で入力してください',
    async initialize() {
      this.todos = []
      await axios
        .get('http://localhost:8080/v1/todos')
        .then((response) => (this.res = response.data.todos))
        .catch((error) => console.log(error))
      if (!this.res) return

      this.res.forEach((res) =>
        this.todos.push({
          id: res.id.value,
          title: res.title.value,
          person: res.person.value,
          done: res.done.value,
        })
      )
    },
    check() {
      console.log('this.res', this.res)
      console.log('this.todos', this.todos)
      console.log('this.todo', this.todo)
      console.log('this.pic', this.pic)
    },
    async addTodo() {
      const { valid } = await this.$refs.form.validate()
      if (!valid) return

      this.isLoading = true
      await axios
        .post('http://localhost:8080/v1/todos', {
          title: this.todo,
          person: this.pic,
          done: false,
        })
        .then((response) => console.log(response.data))
        .catch((error) => {
          console.log(error)
          this.isLoading = false
        })

      this.initialize().then(() => {
        this.isLoading = false
      })
    },
    async changeStatus(item) {
      this.isLoading = true
      const done = item.done ? false : true
      console.log(done)
      await axios
        .put(`http://localhost:8080/v1/todos/${item.id}`, {
          title: item.title,
          person: item.person,
          done: done,
        })
        .then((response) => console.log(response.data))
        .catch((error) => {
          console.log(error)
          this.isLoading = false
        })

      this.initialize().then(() => {
        this.isLoading = false
      })
    },
    editItem(item) {
      this.editedItem = {
        id: item.id,
        title: item.title,
        person: item.person,
      }
      this.dialog = true
    },
    async editSave() {
      this.isLoading = true
      await axios
        .put(`http://localhost:8080/v1/todos/${this.editedItem.id}`, {
          title: this.editedItem.title,
          person: this.editedItem.person,
        })
        .then((response) => console.log(response.data))
        .catch((error) => {
          console.log(error)
          this.isLoading = false
        })

      this.initialize().then(() => {
        this.isLoading = false
      })
      this.dialog = false
    },
    async deleteTodo(item) {
      this.isLoading = true
      await axios
        .delete(`http://localhost:8080/v1/todos/${item.id}`)
        .then((response) => console.log(response.data))
        .catch((error) => {
          console.log(error)
          this.isLoading = false
        })

      this.initialize().then(() => {
        this.isLoading = false
      })
    },
  },
}
</script>
