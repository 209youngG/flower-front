<template>
  <router-view />
</template>

<script setup>
import { onBeforeMount, onMounted } from "vue";

onBeforeMount(async () => {
  if (window.location.href.indexOf("main") > -1) {
    console.log("리모트 관리자 이니셜라이즈");
    const { default: adapter } = await import("remote_app/Adapter");
    adapter.initialize();
  }
});
</script>
