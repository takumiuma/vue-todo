<script>
export default {
  props: {
    title: String,
    totalNum: Number
  },
  methods: {
    titleColor() {
      return this.title === 'In progress...' ? 'unfinished' : 'finished'
    }
  }
}
</script>
<template>
  <span :class="titleColor()">
    {{ title }}
    <v-chip>{{ totalNum }}</v-chip>
  </span>
</template>
<style scoped>
.unfinished {
  background-color: rgb(216, 187, 100);
  padding: 5px;
}
.finished {
  background-color: rgb(135, 211, 120);
  padding: 5px;
}
</style>
