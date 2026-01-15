<template>
  <q-page padding>
    <div class="text-h6 q-mb-md">주문 내역</div>
    <div v-if="orders.length === 0" class="text-center text-grey q-pa-lg">
      주문 내역이 없습니다.
    </div>
    <q-list bordered separator v-else>
      <q-item clickable v-for="order in orders" :key="order.id" @click="$router.push(`/my-orders/${order.id}`)">
        <q-item-section>
          <q-item-label caption>{{ formatDate(order.createdAt) }}</q-item-label>
          <q-item-label class="text-weight-bold">{{ order.itemSummary }}</q-item-label>
          <q-item-label caption>주문번호: {{ order.orderNumber }}</q-item-label>
        </q-item-section>
        
        <q-item-section side>
          <div class="text-primary text-weight-bold">{{ order.totalAmount.toLocaleString() }}원</div>
          <q-badge :color="getStatusColor(order.status)" class="q-mb-xs">{{ order.statusDescription }}</q-badge>
          
          <q-btn 
            v-if="['PENDING', 'PAID'].includes(order.status)" 
            flat round icon="cancel" color="negative" size="sm" 
            @click.stop="handleCancel(order)"
          >
            <q-tooltip>주문 취소</q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMyOrders, cancelOrder } from 'src/api/order'
import { useUserStore } from 'stores/user-store'
import { date, useQuasar } from 'quasar'

const orders = ref([])
const userStore = useUserStore()
const $q = useQuasar()

const loadOrders = async () => {
  try {
    const res = await getMyOrders(userStore.memberId)
    orders.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const handleCancel = async (order) => {
  if (!confirm('주문을 취소하시겠습니까?')) return
  try {
    await cancelOrder(order.id)
    $q.notify({ type: 'positive', message: '주문 취소 완료' })
    loadOrders()
  } catch (e) {
    $q.notify({ type: 'negative', message: '취소 실패' })
  }
}

const formatDate = (isoString) => {
  return date.formatDate(isoString, 'YYYY-MM-DD HH:mm')
}

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING': return 'warning'
    case 'PAID': return 'positive'
    case 'CANCELLED': return 'negative'
    default: return 'grey'
  }
}

onMounted(() => {
  loadOrders()
})
</script>
