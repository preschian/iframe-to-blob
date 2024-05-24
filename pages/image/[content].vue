<template>
  <img v-if="image" :src="image" width="600" height="600" />
  <div v-else>
    <h3>Iframe:</h3>
    <iframe :src="iframeUrl" frameborder="0" width="300" height="300"></iframe>
  </div>
</template>

<script setup>
const status = ref('')
const image = ref('')

const route = useRoute()
const { content } = route.params
const { hash } = route.query
const iframeUrl = `https://image.w.kodadot.xyz/ipfs/${content}/?hash=${hash}`

onMounted(() => {
  window.addEventListener('message', async (event) => {
    if (event.origin.includes('kodadot.xyz') && event.data?.type === 'kodahash/render/completed' && event.data.payload?.image) {
      const base64Response = await fetch(event.data.payload.image)
      const blob = await base64Response.blob()

      status.value = 'done'
      image.value = URL.createObjectURL(blob)
    }
  })
})
</script>

<style>
* {
  margin: 0;
}
</style>
