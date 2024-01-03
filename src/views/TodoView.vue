<script>
import { mdiDelete, mdiPlaylistEdit } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import TodoTableTitle from '../components/TodoTableTitle.vue'
import dayjs from 'dayjs'

export default {
  data() {
    return {
      todo: '',
      todos: [],
      completeTodos: [],
      id: 1,
      pics: ['担当者A', '担当者B', '担当者C'],
      pic: '',
      headers: [
        { title: 'Created_Date', value: 'time', width: '10%' },
        { title: 'Content', value: 'todo', width: '40%' },
        { title: 'Person', value: 'pic', width: '40%' },
        { title: 'Command', value: 'decide', width: '10%' }
      ],
      onEditTodo: false,
      onEditPerson: false,
      icons: {
        mdiDelete,
        mdiPlaylistEdit
      }
    }
  },
  components: {
    SvgIcon,
    TodoTableTitle
  },
  computed: {},
  methods: {
    required: (value) => !!value || '必ず入力してください',
    limit_length: (value) => value.length <= 200 || '200文字以内で入力してください',
    async addTodo() {
      const { valid } = await this.$refs.form.validate()
      if (!valid) return

      this.todos.push({ id: this.id++, content: this.todo, pic: this.pic, time: this.getTime() })
      this.$refs.form.reset()
    },
    deleteTodo(todo) {
      const index = this.todos.indexOf(todo)
      this.todos.splice(index, 1)
    },
    completeTodo(todo) {
      this.completeTodos.push(todo)
      this.deleteTodo(todo)
    },
    returnTodo(todo) {
      this.todos.push(todo)
      const index = this.completeTodos.indexOf(todo)
      this.completeTodos.splice(index, 1)
    },
    clearTodo(emptyTodos, target) {
      if (target === 'todos') {
        this.todos = emptyTodos
      } else {
        this.completeTodos = emptyTodos
      }
    },
    moveTodo(list, target) {
      if (target === 'todos') {
        this.completeTodos.push(...list)
        this.todos.splice(0)
      } else {
        this.todos.push(...list)
        this.completeTodos.splice(0)
      }
    },
    getTime() {
      return dayjs().format('YYYY-MM-DD HH:mm')
    },
    editStart(editTarget) {
      editTarget === 'todo' ? (this.onEditTodo = true) : (this.onEditPerson = true)
    },
    editFinish(editTarget) {
      editTarget === 'todo' ? (this.onEditTodo = false) : (this.onEditPerson = false)
    }
  }
}
</script>
<template>
  <div class="todoView">
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
            <v-btn height="55" color="primary" @click="addTodo">
              <svg-icon type="mdi" :path="icons.mdiPlaylistEdit"></svg-icon>追加
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
    <v-responsive class="mx-auto">
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
              <span v-if="onEditTodo">
                <v-row>
                  <v-col cols="9">
                    <v-text-field
                      v-model="item.content"
                      :rules="[required, limit_length]"
                      counter="200"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-btn @click="editFinish('todo')">編集完了</v-btn>
                  </v-col>
                </v-row>
              </span>
              <span v-else>
                {{ item.content }}
                <v-btn @click="editStart('todo')">編集</v-btn>
              </span>
            </td>
            <td>
              <span v-if="onEditPerson">
                <v-row>
                  <v-col>
                    <v-select :rules="[required]" v-model="item.pic" :items="pics"></v-select>
                  </v-col>
                  <v-col>
                    <v-btn @click="editFinish('pic')">編集完了</v-btn>
                  </v-col>
                </v-row>
              </span>
              <span v-else>
                {{ item.pic }}
                <v-btn @click="editStart('pic')">編集</v-btn>
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
    </v-responsive>
    <v-responsive class="mx-auto">
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
    </v-responsive>
  </div>
</template>
