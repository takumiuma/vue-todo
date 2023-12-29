<script>
import { mdiDelete, mdiPlaylistEdit } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import CommonProps from '../components/CommonProps.vue'

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
        { title: 'Content', value: 'todo' },
        { title: 'Person', value: 'pic' },
        { title: 'Command', value: 'decide' }
      ],
      icons: {
        mdiDelete,
        mdiPlaylistEdit
      }
    }
  },
  components: {
    SvgIcon,
    CommonProps
  },
  computed: {},
  methods: {
    required: (value) => !!value || '必ず入力してください',
    limit_length: (value) => value.length <= 200 || '200文字以内で入力してください',
    async addTodo() {
      const { valid } = await this.$refs.form.validate()
      if (!valid) return

      this.todos.push({ id: this.id++, content: this.todo, pic: this.pic })
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
    <v-responsive class="mx-auto" max-width="700">
      <CommonProps title="In progress..." :totalNum="todos.length" />
      <v-data-table :headers="headers" :items="todos" items-per-page="5">
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.content }}</td>
            <td>{{ item.pic }}</td>
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
    <v-responsive class="mx-auto" max-width="700">
      <CommonProps title="Done!!" :totalNum="completeTodos.length" />
      <v-data-table :headers="headers" :items="completeTodos" items-per-page="5">
        <template v-slot:item="{ item }">
          <tr>
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
