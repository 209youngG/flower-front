<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">페이지를 찾지 못했습니다.</div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        @click="goPage()"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script setup>
import { defineComponent } from "vue";
import { useRouter, useRoute } from "vue-router";

const $router = useRouter();
const $route = useRoute();
const goPage = () => {
  if ($route.path.indexOf("main") > -1) {
    $router.push({ name: "PDRT-BO-001" });
  } else {
    $router.push({ name: "PDRT-FO-001" });
  }
};
// export default defineComponent({
//   name: "ErrorNotFound",
// });
</script>
