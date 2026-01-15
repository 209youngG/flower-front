<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="width: 300px">
      <q-card-section>
        <div class="text-h6">결제</div>
        <div class="text-caption text-grey">주문번호: {{ orderId }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-option-group
          v-model="paymentMethod"
          :options="[
            { label: '신용카드', value: 'CARD' },
            { label: '무통장입금', value: 'BANK_TRANSFER' }
          ]"
          color="primary"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="나중에 하기" color="primary" v-close-popup />
        <q-btn flat label="결제하기" color="primary" @click="onPay" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const props = defineProps({
  modelValue: Boolean,
  orderId: Number
})
const emit = defineEmits(['update:modelValue', 'completed'])

const isOpen = ref(props.modelValue)
const paymentMethod = ref('CARD')
const $q = useQuasar()

watch(() => props.modelValue, (val) => {
  isOpen.value = val
})

watch(isOpen, (val) => {
  emit('update:modelValue', val)
})

const onPay = async () => {
  try {
    await api.post('/api/v1/payments', {
      orderId: props.orderId,
      paymentMethod: paymentMethod.value
    })
    $q.notify({ type: 'positive', message: '결제 완료' })
    emit('completed')
    isOpen.value = false
  } catch (e) {
    $q.notify({ type: 'negative', message: '결제 실패' })
  }
}
</script>
