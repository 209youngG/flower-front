<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="width: 500px; max-width: 90vw;">
      <q-card-section>
        <div class="text-h6">주문 / 배송지 선택</div>
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">배송지 선택</div>
        <q-option-group
          v-model="addressMode"
          :options="[
            { label: '기존 배송지', value: 'saved' },
            { label: '신규 입력', value: 'new' }
          ]"
          color="primary"
          inline
        />

        <!-- 기존 배송지 목록 -->
        <div v-if="addressMode === 'saved'" class="q-mt-md">
          <div v-if="savedAddresses.length === 0" class="text-grey q-pa-md text-center">
            등록된 배송지가 없습니다. 신규 입력을 이용해주세요.
          </div>
          <q-list v-else separator bordered class="rounded-borders">
            <q-item tag="label" v-for="addr in savedAddresses" :key="addr.id" v-ripple>
              <q-item-section avatar top>
                <q-radio v-model="selectedAddressId" :val="addr.id" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ addr.recipientName }} ({{ addr.recipientPhone }})</q-item-label>
                <q-item-label caption>
                  [{{ addr.zipCode }}] {{ addr.street }} {{ addr.city }}
                  <q-badge v-if="addr.isDefault" color="blue" class="q-ml-sm">기본</q-badge>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- 신규 배송지 입력 폼 -->
        <div v-else class="q-mt-md q-gutter-sm">
          <q-input v-model="newAddress.recipientName" label="받는 분" dense filled />
          <q-input v-model="newAddress.recipientPhone" label="연락처" dense filled />
          <div class="row q-col-gutter-sm">
            <div class="col-4">
              <q-input v-model="newAddress.zipCode" label="우편번호" dense filled />
            </div>
          </div>
          <q-input v-model="newAddress.street" label="기본 주소" dense filled />
          <q-input v-model="newAddress.city" label="상세 주소" dense filled />
          <q-checkbox v-model="newAddress.isDefault" label="기본 배송지로 저장" />
        </div>

        <q-separator class="q-my-md" />

        <div class="text-subtitle2 q-mb-sm">배송 요청사항</div>
        <q-input v-model="deliveryNote" label="요청사항을 입력해주세요" dense filled />

      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="취소" v-close-popup />
        <q-btn label="결제하기" color="primary" @click="confirmOrder" :loading="loading" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useUserStore } from 'stores/user-store'
import { useQuasar } from 'quasar'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const userStore = useUserStore()
const $q = useQuasar()

const addressMode = ref('saved')
const savedAddresses = ref([])
const selectedAddressId = ref(null)
const loading = ref(false)
const deliveryNote = ref('문 앞에 부탁드려요')

const newAddress = ref({
  recipientName: userStore.user?.name || '',
  recipientPhone: userStore.user?.phoneNumber || '',
  zipCode: '',
  street: '',
  city: '',
  isDefault: false
})

// 다이얼로그 열릴 때 주소 목록 로드
watch(() => props.modelValue, (val) => {
  if (val) {
    loadAddresses()
  }
})

const loadAddresses = async () => {
  try {
    const res = await api.get(`/api/v1/members/${userStore.memberId}/addresses`)
    savedAddresses.value = res.data
    
    // 기본 배송지 또는 첫 번째 주소 자동 선택
    const defaultAddr = savedAddresses.value.find(a => a.isDefault)
    if (defaultAddr) {
      selectedAddressId.value = defaultAddr.id
    } else if (savedAddresses.value.length > 0) {
      selectedAddressId.value = savedAddresses.value[0].id
    } else {
      addressMode.value = 'new'
    }
  } catch (e) {
    console.error('주소 로드 실패', e)
  }
}

const confirmOrder = async () => {
  let finalAddress = {}

  if (addressMode.value === 'saved') {
    if (!selectedAddressId.value) {
      $q.notify({ type: 'warning', message: '배송지를 선택해주세요.' })
      return
    }
    const selected = savedAddresses.value.find(a => a.id === selectedAddressId.value)
    finalAddress = {
      deliveryName: selected.recipientName,
      deliveryPhone: selected.recipientPhone,
      deliveryAddress: `[${selected.zipCode}] ${selected.street} ${selected.city}`
    }
  } else {
    // 신규 주소 유효성 검사
    if (!newAddress.value.recipientName || !newAddress.value.street) {
      $q.notify({ type: 'warning', message: '배송 정보를 입력해주세요.' })
      return
    }
    
    // 신규 주소 저장 요청 (옵션)
    if (newAddress.value.isDefault) {
      try {
        await api.post(`/api/v1/members/${userStore.memberId}/addresses`, newAddress.value)
      } catch (e) {
        console.error('주소 저장 실패', e)
      }
    }

    finalAddress = {
      deliveryName: newAddress.value.recipientName,
      deliveryPhone: newAddress.value.recipientPhone,
      deliveryAddress: `[${newAddress.value.zipCode}] ${newAddress.value.street} ${newAddress.value.city}`
    }
  }

  emit('confirm', {
    ...finalAddress,
    deliveryNote: deliveryNote.value
  })
}
</script>
