<script setup>
import { VBtn,VIcon,VTextField,VResponsive } from 'vuetify/components'
import { mdiDelete,mdiCheckBold,mdiPlaylistEdit } from '@mdi/js';
import SvgIcon from '@jamescoyle/vue-icon';
</script>
<script>
export default {
  data() {
    return {
      todo:'',
      todos:[],
      completeTodos:[],
      id:1,
      icons:{
        mdiCheckBold,
        mdiDelete,
        mdiPlaylistEdit,
      },
      name: "my-component",
      components: {
        SvgIcon
      },
    }
  },
  computed:{

  },
  methods:{
    addTodo(){
      this.todos.push({id:this.id++,content:this.todo});
      this.todo = '';
    },
    deleteTodo(todo){
      const index = this.todos.indexOf(todo);
      this.todos.splice(index,1);
    },
    completeTodo(todo){
      this.completeTodos.push(todo);
      this.deleteTodo(todo);
    },
    returnTodo(todo){
      this.todos.push(todo);
      const index = this.completeTodos.indexOf(todo);
      this.completeTodos.splice(index,1);
    }
  }
}
</script>
<template>
  <v-responsive class="mx-auto" max-width="400">
    <v-text-field v-model="todo" clearable label="TODOを入力">
      <template v-slot:append>
        <v-btn @click="addTodo">
          <svg-icon type="mdi" :path="icons.mdiPlaylistEdit"></svg-icon>追加
        </v-btn>
      </template>
    </v-text-field>
  </v-responsive>
  <v-responsive class="mx-auto" max-width="500">
    <div id="todoArea">Todoリスト
      <ul v-for=" todo in todos" :key="todo.id">
        <li>
          {{todo.content}}
          <v-btn @click="deleteTodo(todo)">
            <svg-icon type="mdi" :path="icons.mdiDelete"></svg-icon>削除
          </v-btn>
          <v-btn color="primary" @click="completeTodo(todo)">
            <v-icon class="ma-2" start icon="mdi-checkbox-marked-circle"></v-icon>完了
          </v-btn>
        </li>
      </ul>
    </div>
    <div id="completeArea">完了済みのTodo
      <ul v-for=" completeTodo in completeTodos" :key="completeTodo.id">
        <li>
          {{completeTodo.content}}
          <v-btn color="orange-darken-2" @click="returnTodo(completeTodo)">
            <v-icon start icon="mdi-arrow-left"></v-icon>戻す
          </v-btn>
        </li>
      </ul>
    </div>
  </v-responsive>
</template>

<style>
  #todoArea{
    background-color: gray;
    padding: 4px 16px;
    color:black;
  }
  #completeArea{
    background-color: aliceblue;
    padding: 4px 16px;
    color:black;
  }
  ul {
  list-style: none;
  }
</style>