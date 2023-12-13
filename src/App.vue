<script>
export default {

  data() {
    return {
      todo:'',
      todos:[],
      completeTodos:[],
      id:1,
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
  <input type="text" v-model="todo">
  <button @click="addTodo">追加</button>
  <div id="todoArea">Todoリスト
    <ul v-for=" todo in todos" :key="todo.id">
      <li>
        {{todo.content}}
        <button @click="deleteTodo(todo)">削除</button>
        <button @click="completeTodo(todo)">完了</button>
      </li>
    </ul>
  </div>
  <div id="completeArea">完了済みのTodo
    <ul v-for=" completeTodo in completeTodos" :key="completeTodo.id">
      <li>
        {{completeTodo.content}}
        <button @click="returnTodo(completeTodo)">戻る</button>
      </li>
    </ul>
  </div>
</template>

<style>
  #todoArea{
    width: 400px;
    height: 200px;
    background-color: gray;
    padding: 4px 16px;
    color:black;
  }
  #completeArea{
    width: 400px;
    height: 200px;
    background-color: aliceblue;
    padding: 4px 16px;
    color:black;
  }
</style>