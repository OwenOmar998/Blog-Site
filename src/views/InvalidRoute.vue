<template>
  <div class="blog-post" style="display: block">
    <h1>404 Not Found</h1>
    <p>The requested URL {{ url }} page could not be found.</p>
  </div>
</template>

<script lang="ts">
import { useRoute } from "vue-router";
export default {
  name: "InvalidRoute",
  setup() {
    const route = useRoute();
    const url = route.path;

    return { url };
  },
};
</script>
