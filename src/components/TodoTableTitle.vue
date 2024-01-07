<script>
export default {
  emits: ['clear-click', 'move-click'],
  props: {
    title: String,
    todoList: Array
  },
  data() {
    return {
      emptyTodos: [],
      message: ''
    }
  },
  methods: {
    totalNum() {
      return this.todoList.length
    },
    titleColor() {
      if (this.title === 'In progress...') {
        this.message = '全てを完了に移動'
        return 'unfinished'
      }
      this.message = '全てを着手中に移動'
      return 'finished'
    },
    sendEmpty() {
      this.$emit('clear-click', this.emptyTodos)
      this.emptyTodos = []
    },
    sendList() {
      this.$emit('move-click', this.todoList)
    }
  }
}
</script>
<template>
  <v-layout :class="titleColor()">
    {{ title }}
    <v-chip>{{ totalNum() }}</v-chip>
    <div class="ml-auto">
      <v-btn @click="sendEmpty()">リストを空にする</v-btn>
      <v-btn @click="sendList()">{{ message }}</v-btn>
    </div>
  </v-layout>
</template>
<style scoped>
.unfinished {
  background-color: rgb(216, 187, 100);
  padding: 5px;
  border-radius: 5px;
}
.finished {
  background-color: rgb(135, 211, 120);
  padding: 5px;
  border-radius: 5px;
}
</style>
