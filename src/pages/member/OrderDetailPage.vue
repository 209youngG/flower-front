<template>
  <q-page padding>
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h6">주문 상세</div>
      <q-btn 
        v-if="order && ['PENDING', 'PAID'].includes(order.status)"
        color="negative" 
        label="주문 취소" 
        outline
        @click="handleCancel"
      />
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
            <div class="col-8 text-primary">{{ order.statusDescription }}</div>
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
import { useRoute, useRouter } from 'vue-router'
import { getOrder, cancelOrder } from 'src/api/order'
import { date, useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const order = ref(null)
const loading = ref(false)

const loadOrder = async () => {
  loading.value = true
  try {
    const res = await getOrder(route.params.id)
    order.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleCancel = async () => {
  if (!confirm('정말 주문을 취소하시겠습니까?')) return
  
  try {
    await cancelOrder(order.value.id)
    $q.notify({ type: 'positive', message: '주문이 취소되었습니다.' })
    await loadOrder() // 상태 갱신
  } catch (e) {
    $q.notify({ type: 'negative', message: '취소 실패' })
  }
}

const formatDate = (isoString) => {
  return date.formatDate(isoString, 'YYYY-MM-DD HH:mm')
}

onMounted(() => {
  loadOrder()
})
</script>
