<script setup lang="ts">
import { onMounted, ref } from 'vue'
import board from "../board";

defineProps<{ msg: string }>()

const count = ref(0)
let boardMessage = ref("");

onMounted(async () => {
  const { output } = await board({ message: "Hello, Breadboard!" });
  boardMessage.value = output as string;
})
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>Board Output: {{ boardMessage }}</p>
  
  <p class="read-the-docs">Click on the Vite, Vue and Breadboard logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
