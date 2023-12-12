<script>
export default {

  data() {
    return {
      todo:'',
    }
  },
  computed:{

  },
  methods:{
    addTodo(){
      const todoArea = document.querySelector('#todoArea');
      const div = document.createElement('div');
      div.innerText = this.todo;

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "削除";
      deleteButton.addEventListener("click",() => {
        this.deleteTodo(deleteButton.closest("div"));
      })

      const completeButton = document.createElement("button");
      completeButton.innerText = "完了";
      completeButton.addEventListener("click",() => {
        this.completeTodo(completeButton.closest("div"));
      })

      div.appendChild(deleteButton);
      div.appendChild(completeButton);
      todoArea.appendChild(div);
      this.todo = '';
      
    },
    deleteTodo(el){
      el.remove();
    },
    completeTodo(el){
      const completeArea = document.querySelector('#completeArea');
      completeArea.appendChild(el);
    }
  }
}
</script>
<template>
  <input type="text" v-model="todo">
  <button v-on:click="addTodo">追加</button>
  <div id="todoArea">Todoリスト</div>
  <div id="completeArea">完了済みのTodo</div>
</template>

<style>
  #todoArea{
    width: 400px;
    height: 100px;
    background-color: gray;
    padding: 4px 16px;
    color:black;
  }
  #completeArea{
    width: 400px;
    height: 100px;
    background-color: aliceblue;
    padding: 4px 16px;
    color:black;
  }
</style>