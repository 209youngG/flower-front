<template>
  <q-page padding>
    <div class="text-h6 q-mb-md">리뷰 작성</div>

    <div class="q-gutter-md">
      <!-- Image Preview Area -->
      <div
        v-if="imageData"
        class="relative-position"
        style="width: 150px; height: 150px"
      >
        <q-img
          :src="imageData"
          style="width: 100%; height: 100%; border-radius: 8px"
        />
        <q-btn
          round
          dense
          color="negative"
          icon="close"
          size="sm"
          class="absolute-top-right q-mt-xs q-mr-xs"
          @click="clearImage"
        />
      </div>

      <!-- Camera Button -->
      <div
        v-else
        @click="takePhoto"
        class="bg-grey-3 rounded-borders flex flex-center cursor-pointer"
        style="width: 150px; height: 150px"
      >
        <div class="text-center text-grey-7">
          <q-icon name="camera_alt" size="2em" />
          <div class="text-caption">사진 촬영</div>
        </div>
      </div>

      <q-input
        v-model="content"
        type="textarea"
        label="리뷰 내용"
        filled
        placeholder="꽃은 어떠셨나요? 솔직한 후기를 남겨주세요."
        rows="5"
      />

      <div class="row justify-end">
        <q-btn
          label="등록하기"
          color="primary"
          @click="submitReview"
          :disable="!content"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useQuasar } from "quasar";
import { nativeBridge } from "src/common/native-bridge";
// import { createReview } from 'src/api/review' // Assume this exists or mock it

const $q = useQuasar();
const content = ref("");
const imageData = ref<string | null>(null);

const takePhoto = async () => {
  try {
    const base64 = await nativeBridge.openCamera();
    // Prefix if missing (Android might return raw base64)
    imageData.value = base64.startsWith("data:image")
      ? base64
      : `data:image/jpeg;base64,${base64}`;
    nativeBridge.showToast("사진이 첨부되었습니다");
  } catch (e) {
    console.error(e);
    $q.notify({ type: "negative", message: "사진 촬영에 실패했습니다" });
  }
};

const clearImage = () => {
  imageData.value = null;
};

const submitReview = async () => {
  // Mock API Call
  $q.loading.show();
  try {
    // await createReview({ content: content.value, image: imageData.value })
    await new Promise((r) => setTimeout(r, 1000)); // Simulation

    $q.notify({ type: "positive", message: "리뷰가 등록되었습니다" });
    nativeBridge.vibrate(200); // Tactile feedback via Bridge
    // router.back()
  } finally {
    $q.loading.hide();
  }
};
</script>
