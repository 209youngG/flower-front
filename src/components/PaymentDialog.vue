<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="width: 350px">
      <q-card-section>
        <div class="text-h6">결제</div>
        <div class="text-caption text-grey">
          {{
            isRetry
              ? "결제에 실패했습니다. 다시 시도하시겠습니까?"
              : "결제 수단을 선택해주세요"
          }}
        </div>
        <div
          v-if="errorMessage"
          class="q-mt-sm text-negative text-caption bg-red-1 q-pa-xs rounded-borders"
        >
          <q-icon name="error" /> {{ errorMessage }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none" v-if="!isProcessing">
        <q-option-group
          v-model="paymentMethod"
          :options="[
            { label: '신용카드', value: 'CARD' },
            { label: '무통장입금', value: 'BANK_TRANSFER' },
            { label: '간편결제 (Toss)', value: 'TOSS' },
          ]"
          color="primary"
          :disable="isProcessing"
        />
      </q-card-section>

      <q-card-section v-else class="flex flex-center q-pa-lg">
        <q-spinner color="primary" size="2em" />
        <div class="q-ml-md">결제 처리 중...</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="취소"
          color="grey"
          v-close-popup
          :disable="isProcessing"
          @click="resetState"
        />
        <q-btn
          :label="isRetry ? '재시도' : '결제하기'"
          color="primary"
          @click="onPay"
          :loading="isProcessing"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: boolean;
  isProcessing?: boolean;
  error?: string | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
  (e: "pay", method: string): void;
  (e: "cancel"): void;
}>();

const isOpen = ref(props.modelValue);
const paymentMethod = ref("CARD");
const isRetry = ref(false);
const errorMessage = ref<string | null>(null);

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val;
    if (val) {
      // 다이얼로그가 열릴 때 에러가 있다면 재시도 모드
      if (props.error) {
        isRetry.value = true;
        errorMessage.value = props.error;
      } else {
        isRetry.value = false;
        errorMessage.value = null;
      }
    }
  }
);

watch(
  () => props.error,
  (val) => {
    if (val) {
      isRetry.value = true;
      errorMessage.value = val;
    }
  }
);

watch(isOpen, (val) => {
  emit("update:modelValue", val);
  if (!val) {
    emit("cancel");
  }
});

const onPay = () => {
  // 재시도 시 에러 메시지 초기화
  errorMessage.value = null;
  emit("pay", paymentMethod.value);
};

const resetState = () => {
  isRetry.value = false;
  errorMessage.value = null;
  paymentMethod.value = "CARD";
};
</script>
