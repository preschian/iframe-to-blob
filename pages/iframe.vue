<template>
  <img v-if="image" :src="image" width="100%" height="100%" />
  <div v-else>
    <h3>Iframe:</h3>
    <iframe :src="url?.toString()" frameborder="0" width="600" height="600"></iframe>
  </div>
</template>

<script setup>
const image = ref('')

const route = useRoute()
const { url } = route.query

onMounted(() => {
  window.addEventListener('message', async (event) => {
    if (event.data?.type === 'kodahash/render/completed' && event.data.payload?.image) {
      const base64Response = await fetch(event.data.payload.image)
      const blob = await base64Response.blob()

      image.value = URL.createObjectURL(blob)
    }
  })
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}
</style>
