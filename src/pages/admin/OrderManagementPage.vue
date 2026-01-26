<template>
  <q-page padding>
    <div class="text-h6 q-mb-md">주문 관리</div>

    <q-table
      title="주문 목록"
      :rows="orders"
      :columns="columns"
      row-key="id"
      :loading="loading"
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip :color="getStatusColor(props.row.status)" text-color="white">
            {{ getStatusLabel(props.row.status) }}
          </q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-totalAmount="props">
        <q-td :props="props">
          {{ props.row.totalAmount.toLocaleString() }}원
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round icon="visibility" color="info" @click="$router.push(`/admin/orders/${props.row.id}`)" />
          <q-btn flat round icon="edit" color="primary" @click="openStatusDialog(props.row)" />
        </q-td>
      </template>
    </q-table>

    <!-- 상태 변경 다이얼로그 -->
    <q-dialog v-model="statusDialog.show">
      <q-card style="width: 400px">
        <q-card-section>
          <div class="text-h6">주문 상태 변경</div>
          <div class="text-subtitle2 text-grey">주문번호: {{ statusDialog.orderNumber }}</div>
        </q-card-section>

        <q-card-section>
          <q-select 
            v-model="statusDialog.status" 
            :options="statusOptions" 
            label="상태" 
            filled 
            emit-value 
            map-options 
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="취소" v-close-popup />
          <q-btn label="저장" color="primary" @click="updateStatus" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar, date } from 'quasar'

const $q = useQuasar()
const orders = ref([])
const loading = ref(false)

const columns = [
  { name: 'orderNumber', label: '주문번호', field: 'orderNumber', sortable: true, align: 'left' },
  { name: 'itemSummary', label: '상품명', field: 'itemSummary', align: 'left' },
  { name: 'totalAmount', label: '결제금액', field: 'totalAmount', sortable: true, align: 'right' },
  { name: 'status', label: '상태', field: 'status', sortable: true, align: 'center' },
  { name: 'createdAt', label: '주문일시', field: row => date.formatDate(row.createdAt, 'YYYY-MM-DD HH:mm'), sortable: true, align: 'center' },
  { name: 'actions', label: '관리', field: 'actions', align: 'center' }
]

const statusDialog = ref({
  show: false,
  id: null,
  orderNumber: '',
  status: ''
})

const statusOptions = [
  { label: '결제대기', value: 'PENDING' },
  { label: '결제완료', value: 'PAID' },
  { label: '상품준비중', value: 'PROCESSING' },
  { label: '배송중', value: 'SHIPPED' },
  { label: '배송완료', value: 'DELIVERED' },
  { label: '주문취소', value: 'CANCELLED' },
  { label: '환불완료', value: 'REFUNDED' }
]

const getStatusColor = (status) => {
  const map = {
    'PENDING': 'grey',
    'PAID': 'teal',
    'Processing': 'orange',
    'PROCESSING': 'orange',
    'SHIPPED': 'blue',
    'DELIVERED': 'green',
    'CANCELLED': 'red',
    'REFUNDED': 'purple'
  }
  return map[status] || 'grey'
}

const getStatusLabel = (status) => {
  const option = statusOptions.find(opt => opt.value === status)
  return option ? option.label : status
}

const loadOrders = async () => {
  loading.value = true
  try {
    const res = await api.get('/api/v1/orders')
    orders.value = res.data
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: '주문 목록 로드 실패' })
  } finally {
    loading.value = false
  }
}

const openStatusDialog = (order) => {
  statusDialog.value = {
    show: true,
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status
  }
}

const updateStatus = async () => {
  try {
    await api.put(`/api/v1/orders/${statusDialog.value.id}/status`, {
      status: statusDialog.value.status
    })
    $q.notify({ type: 'positive', message: '상태가 변경되었습니다.' })
    statusDialog.value.show = false
    loadOrders()
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: '상태 변경 실패' })
  }
}

onMounted(() => {
  loadOrders()
})
</script>
