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
          <q-item-label caption class="q-mb-xs">
             <div v-for="opt in item.options" :key="opt.productOptionId">
               - {{ getOptionName(item.productId, opt.productOptionId) }} 
               <span v-if="opt.priceAdjustment > 0">(+{{ opt.priceAdjustment.toLocaleString() }}원)</span>
             </div>
          </q-item-label>
          <q-item-label caption>{{ item.unitPrice.toLocaleString() }}원</q-item-label>
          
          <q-btn flat dense color="primary" label="옵션 변경" size="sm" @click="openOptionDialog(item)" class="q-mt-xs self-start" />
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

    <!-- 옵션 변경 다이얼로그 -->
    <q-dialog v-model="optionDialog.show">
      <q-card style="width: 400px">
        <q-card-section>
          <div class="text-h6">옵션 변경</div>
        </q-card-section>

        <q-card-section>
          <div v-if="optionDialog.productOptions.length > 0">
            <div v-for="opt in optionDialog.productOptions" :key="opt.id" class="q-mb-sm">
              <q-checkbox 
                v-model="optionDialog.selectedOptionIds" 
                :val="opt.id" 
                :label="`${opt.name}: ${opt.optionValue} (+${opt.priceAdjustment.toLocaleString()}원)`" 
              />
            </div>
          </div>
          <div v-else class="text-center text-grey">변경 가능한 옵션이 없습니다.</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="취소" v-close-popup />
          <q-btn flat label="변경" color="primary" @click="confirmOptionChange" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <PaymentDialog v-model="showPaymentDialog" :orderId="currentOrderId" @completed="onPaymentCompleted" />
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useCartStore } from 'stores/cart-store'
import { useUserStore } from 'stores/user-store'
import { useQuasar } from 'quasar'
import { createOrder } from 'src/api/order'
import { getProduct } from 'src/api/product' // 추가
import PaymentDialog from 'components/PaymentDialog.vue'

const cartStore = useCartStore()
const userStore = useUserStore()
const $q = useQuasar()

const showPaymentDialog = ref(false)
const currentOrderId = ref(0)

// 옵션 다이얼로그 상태
const optionDialog = ref({
  show: false,
  cartItem: null,
  productOptions: [],
  selectedOptionIds: []
})

// 상품 정보 캐시 (옵션명 조회용)
const productCache = ref({}) 

onMounted(async () => {
  await cartStore.loadCart()
  // 장바구니에 있는 상품들의 상세 정보를 로드하여 캐싱 (옵션명 표시 등을 위함)
  if (cartStore.items.length > 0) {
    const productIds = [...new Set(cartStore.items.map(item => item.productId))]
    await Promise.all(productIds.map(loadProductInfo))
  }
})

const loadProductInfo = async (productId) => {
  if (productCache.value[productId]) return
  try {
    const res = await getProduct(productId)
    productCache.value[productId] = res.data
  } catch (e) {
    console.error('Failed to load product info', e)
  }
}

const getOptionName = (productId, optionId) => {
  const product = productCache.value[productId]
  if (!product || !product.options) return 'Unknown Option'
  const opt = product.options.find(o => o.id === optionId)
  return opt ? `${opt.name}: ${opt.optionValue}` : 'Unknown Option'
}

const openOptionDialog = async (item) => {
  await loadProductInfo(item.productId)
  const product = productCache.value[item.productId]
  
  optionDialog.value = {
    show: true,
    cartItem: item,
    productOptions: product ? product.options : [],
    selectedOptionIds: item.options.map(o => o.productOptionId)
  }
}

const confirmOptionChange = async () => {
  const { cartItem, selectedOptionIds } = optionDialog.value
  try {
    await cartStore.updateItemOptions(cartItem.id, selectedOptionIds)
    $q.notify({ type: 'positive', message: '옵션이 변경되었습니다.' })
    optionDialog.value.show = false
  } catch (e) {
    $q.notify({ type: 'negative', message: '옵션 변경 실패' })
  }
}

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
