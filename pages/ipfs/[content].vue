<template>
  <div style="font-family: monospace">
    <h1>Capture Iframe</h1>
    <h2>{{ status }}</h2>

    <div>
      <h3>Iframe:</h3>
      <iframe :src="iframeUrl" frameborder="0" width="300" height="300"></iframe>
    </div>

    <div v-if="image">
      <h3>Preview:</h3>
      <img :src="image" alt="" />
    </div>
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
