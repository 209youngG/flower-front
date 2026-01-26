<template>
  <q-page padding>
    <div class="row justify-between items-center q-mb-md">
      <div class="row items-center q-gutter-x-sm">
        <q-btn icon="arrow_back" flat round @click="$router.push('/admin/orders')" />
        <div class="text-h6">주문 상세 관리</div>
      </div>
    </div>
    
    <div v-if="loading" class="text-center">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="order">
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold">주문 정보</div>
          <div class="row q-mt-sm">
            <div class="col-4 text-grey">주문번호</div>
            <div class="col-8">{{ order.orderNumber }}</div>
          </div>
          <div class="row q-mt-xs">
            <div class="col-4 text-grey">주문일시</div>
            <div class="col-8">{{ formatDate(order.createdAt) }}</div>
          </div>
          <div class="row q-mt-xs">
            <div class="col-4 text-grey">상태</div>
            <div class="col-8">
              <q-chip :color="getStatusColor(order.status)" text-color="white" size="sm">
                {{ getStatusLabel(order.status) }}
              </q-chip>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold">배송지 정보</div>
          <div class="q-mt-sm">
            <div>{{ order.deliveryName }} / {{ order.deliveryPhone }}</div>
            <div>{{ order.deliveryAddress }}</div>
            <div class="text-caption text-grey">{{ order.deliveryNote }}</div>
          </div>
          
          <div v-if="deliveryInfo" class="q-mt-md bg-grey-2 q-pa-sm rounded-borders">
            <div class="text-subtitle2">배송 현황</div>
            <div class="row q-mt-xs">
              <div class="col-4">상태</div>
              <div class="col-8 text-primary text-weight-bold">{{ getStatusLabel(deliveryInfo.status) }}</div>
            </div>
            <div v-if="deliveryInfo.trackingNumber" class="row q-mt-xs">
              <div class="col-4">운송장</div>
              <div class="col-8">{{ deliveryInfo.courierName }} {{ deliveryInfo.trackingNumber }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold">주문 상품</div>
          <q-list separator>
            <q-item v-for="item in order.items" :key="item.productId">
              <q-item-section>
                <q-item-label>{{ item.productName }}</q-item-label>
                <q-item-label caption>{{ item.unitPrice.toLocaleString() }}원 x {{ item.quantity }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                {{ (item.unitPrice * item.quantity).toLocaleString() }}원
              </q-item-section>
            </q-item>
          </q-list>
          <q-separator class="q-my-md" />
          <div class="row justify-between text-h6">
            <div>총 결제금액</div>
            <div class="text-primary">{{ order.totalAmount.toLocaleString() }}원</div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'boot/axios'
import { date } from 'quasar'

const route = useRoute()
const order = ref(null)
const deliveryInfo = ref(null)
const loading = ref(false)

const loadOrder = async () => {
  loading.value = true
  try {
    // Admin also uses the same endpoint if it returns DTO. 
    // Assuming /api/v1/orders/{id} is accessible by admin.
    const res = await api.get(`/api/v1/orders/${route.params.id}`)
    order.value = res.data
    
    await loadDeliveryInfo(order.value.id)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const loadDeliveryInfo = async (orderId) => {
  try {
    const res = await api.get('/api/v1/deliveries', { params: { orderId } })
    deliveryInfo.value = res.data
  } catch (e) {
    console.log('배송 정보 없음')
  }
}

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
  const map = {
    'PENDING': '결제대기',
    'PAID': '결제완료',
    'PROCESSING': '상품준비중',
    'SHIPPED': '배송중',
    'DELIVERED': '배송완료',
    'CANCELLED': '주문취소',
    'REFUNDED': '환불완료'
  }
  return map[status] || status
}

const formatDate = (isoString) => {
  return date.formatDate(isoString, 'YYYY-MM-DD HH:mm')
}

onMounted(() => {
  loadOrder()
})
</script>
