<template>
  <q-page padding>
    <div class="text-h6 q-mb-md">배송 관리</div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
        <q-input v-model="searchOrderId" label="주문번호 검색" outlined dense @keyup.enter="searchDelivery">
          <template v-slot:append>
            <q-icon name="search" class="cursor-pointer" @click="searchDelivery" />
          </template>
        </q-input>
      </div>
    </div>

    <q-table
      title="배송 목록"
      :rows="deliveries"
      :columns="columns"
      row-key="id"
      :loading="loading"
      v-if="deliveries.length > 0"
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip :color="getStatusColor(props.row.status)" text-color="white">
            {{ getStatusLabel(props.row.status) }}
          </q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round icon="edit" color="primary" @click="openStatusDialog(props.row)" />
        </q-td>
      </template>
    </q-table>

    <div v-else-if="searched && deliveries.length === 0" class="text-center q-pa-lg text-grey">
      검색 결과가 없습니다.
    </div>

    <!-- 상태 변경 다이얼로그 -->
    <q-dialog v-model="statusDialog.show">
      <q-card style="width: 400px">
        <q-card-section>
          <div class="text-h6">배송 상태 변경</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="updateStatus" class="q-gutter-md">
            <q-select 
              v-model="statusDialog.status" 
              :options="statusOptions" 
              label="상태" 
              filled 
              emit-value 
              map-options 
            />
            
            <div v-if="statusDialog.status === 'SHIPPING'">
              <q-input v-model="statusDialog.courierName" label="택배사" filled />
              <q-input v-model="statusDialog.trackingNumber" label="운송장 번호" filled />
            </div>

            <div class="row justify-end q-mt-md">
              <q-btn flat label="취소" v-close-popup />
              <q-btn label="저장" type="submit" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const searchOrderId = ref('')
const deliveries = ref([])
const searched = ref(false)
const loading = ref(false)

const columns = [
  { name: 'orderNumber', label: '주문번호', field: 'orderNumber', sortable: true, align: 'left' },
  { name: 'receiverName', label: '수령인', field: 'receiverName', align: 'left' },
  { name: 'address', label: '주소', field: 'address', align: 'left' },
  { name: 'status', label: '상태', field: 'status', align: 'center' },
  { name: 'tracking', label: '운송장', field: row => row.trackingNumber ? `${row.courierName} ${row.trackingNumber}` : '-', align: 'left' },
  { name: 'actions', label: '관리', field: 'actions', align: 'center' }
]

const statusDialog = ref({
  show: false,
  id: null,
  status: '',
  courierName: '',
  trackingNumber: ''
})

const statusOptions = [
  { label: '배송 대기', value: 'PENDING' },
  { label: '준비중', value: 'PREPARING' },
  { label: '배송중', value: 'SHIPPING' },
  { label: '배송완료', value: 'COMPLETED' },
  { label: '픽업준비완료', value: 'READY_FOR_PICKUP' }
]

const getStatusLabel = (status) => {
  const map = {
    'PENDING': '대기',
    'PREPARING': '준비중',
    'SHIPPING': '배송중',
    'READY_FOR_PICKUP': '픽업대기',
    'COMPLETED': '완료',
    'FAILED': '실패'
  }
  return map[status] || status
}

const getStatusColor = (status) => {
  const map = {
    'PENDING': 'grey',
    'PREPARING': 'orange',
    'SHIPPING': 'blue',
    'READY_FOR_PICKUP': 'purple',
    'COMPLETED': 'green',
    'FAILED': 'red'
  }
  return map[status] || 'grey'
}

const loadAllDeliveries = async () => {
  loading.value = true
  try {
    const res = await api.get('/api/v1/deliveries')
    if (Array.isArray(res.data)) {
      deliveries.value = res.data
    } else {
      deliveries.value = [res.data]
    }
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: '배송 목록 로드 실패' })
  } finally {
    loading.value = false
  }
}

const searchDelivery = async () => {
  if (!searchOrderId.value) {
    loadAllDeliveries()
    return
  }
  
  loading.value = true
  try {
    const res = await api.get('/api/v1/deliveries', { params: { orderId: searchOrderId.value } })
    deliveries.value = [res.data]
  } catch (e) {
    console.error(e)
    deliveries.value = []
    $q.notify({ type: 'warning', message: '배송 정보를 찾을 수 없습니다.' })
  } finally {
    loading.value = false
  }
}

const openStatusDialog = (item) => {
  statusDialog.value = {
    show: true,
    id: item.id,
    status: item.status,
    courierName: item.courierName || '',
    trackingNumber: item.trackingNumber || ''
  }
}

const updateStatus = async () => {
  try {
    await api.put(`/api/v1/deliveries/${statusDialog.value.id}`, {
      status: statusDialog.value.status,
      courierName: statusDialog.value.courierName,
      trackingNumber: statusDialog.value.trackingNumber
    })
    $q.notify({ type: 'positive', message: '상태가 변경되었습니다.' })
    statusDialog.value.show = false
    
    if (searchOrderId.value) {
      searchDelivery()
    } else {
      loadAllDeliveries()
    }
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: '상태 변경 실패' })
  }
}

onMounted(() => {
  loadAllDeliveries()
})
</script>
