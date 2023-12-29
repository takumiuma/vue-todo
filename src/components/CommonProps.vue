<script>
export default {
  props: {
    title: String,
    totalNum: Number
  }
}
</script>
<template>
  <div :class="{ unfinished: title === 'In progress...', finished: title === 'Done!!' }">
    <span>{{ title }}</span> <span>{{ totalNum }}</span>
  </div>
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
