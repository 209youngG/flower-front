<template>
  <q-page padding>
    <div class="text-h6 q-mb-md">장바구니</div>

    <q-list bordered separator v-if="cartStore.items.length > 0">
      <q-item v-for="item in cartStore.items" :key="item.id">
        <q-item-section avatar>
          <q-avatar rounded>
            <img :src="item.thumbnailUrl || 'https://cdn.quasar.dev/img/boy-avatar.png'">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ item.productName }}</q-item-label>
          <q-item-label caption>{{ item.unitPrice.toLocaleString() }}원</q-item-label>
        </q-item-section>

        <q-item-section side>
          <div class="row items-center">
            <q-btn flat round icon="remove" size="sm" @click="updateQty(item, -1)" :disable="item.quantity <= 1" />
            <span class="q-mx-sm">{{ item.quantity }}</span>
            <q-btn flat round icon="add" size="sm" @click="updateQty(item, 1)" />
          </div>
        </q-item-section>

        <q-item-section side>
          <q-btn flat round icon="delete" color="negative" @click="cartStore.removeItem(item.id)" />
        </q-item-section>
      </q-item>
    </q-list>

    <div v-else class="text-center q-pa-lg text-grey">
      장바구니가 비어있습니다.
    </div>

    <div class="q-mt-lg flex justify-between items-center" v-if="cartStore.items.length > 0">
      <div class="text-h6">총 결제금액: {{ cartStore.totalPrice.toLocaleString() }}원</div>
      <q-btn color="primary" label="주문하기" @click="handleCheckout" />
    </div>

    <PaymentDialog v-model="showPaymentDialog" :orderId="currentOrderId" @completed="onPaymentCompleted" />
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useCartStore } from 'stores/cart-store'
import { useUserStore } from 'stores/user-store'
import { useQuasar } from 'quasar'
import { createOrder } from 'src/api/order'
import PaymentDialog from 'components/PaymentDialog.vue'

const cartStore = useCartStore()
const userStore = useUserStore()
const $q = useQuasar()

const showPaymentDialog = ref(false)
const currentOrderId = ref(0)

onMounted(() => {
  cartStore.loadCart()
})

const updateQty = (item, change) => {
  cartStore.updateItem(item.id, item.quantity + change)
}

const handleCheckout = async () => {
  if (cartStore.items.length === 0) return
  
  $q.loading.show({ message: '주문 중...' })
  try {
    const res = await createOrder({
      memberId: userStore.memberId,
      deliveryMethod: 'SHIPPING',
      deliveryAddress: '서울시 강남구 테헤란로 123',
      deliveryPhone: '010-1234-5678',
      deliveryName: userStore.user?.name || '홍길동',
      deliveryNote: '문 앞에 부탁드려요'
    })
    
    currentOrderId.value = res.data.id
    showPaymentDialog.value = true
    
    await cartStore.loadCart()
  } catch (e) {
    $q.notify({ type: 'negative', message: '주문 실패' })
  } finally {
    $q.loading.hide()
  }
}

const onPaymentCompleted = () => {
  cartStore.loadCart()
}
</script>
