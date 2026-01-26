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
      <q-btn color="primary" label="주문하기" @click="openCheckout" />
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

    <CheckoutDialog v-model="showCheckoutDialog" @confirm="onDeliveryConfirmed" />
    <PaymentDialog v-model="showPaymentDialog" @pay="handlePayment" />
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useCartStore } from 'stores/cart-store'
import { useUserStore } from 'stores/user-store'
import { useQuasar } from 'quasar'
import { createOrder } from 'src/api/order'
import { processPayment } from 'src/api/payment'
import { getProduct } from 'src/api/product' 
import PaymentDialog from 'components/PaymentDialog.vue'
import CheckoutDialog from 'components/CheckoutDialog.vue' 

const cartStore = useCartStore()
const userStore = useUserStore()
const $q = useQuasar()

const showPaymentDialog = ref(false)
const showCheckoutDialog = ref(false)
const pendingDeliveryInfo = ref(null)

const optionDialog = ref({
  show: false,
  cartItem: null,
  productOptions: [],
  selectedOptionIds: []
})

const productCache = ref({}) 

onMounted(async () => {
  await cartStore.loadCart()
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

const openCheckout = () => {
  if (cartStore.items.length === 0) return
  showCheckoutDialog.value = true
}

// 1. 배송지 선택 후 "결제 진행" 클릭 시 -> 배송 정보 저장 & 결제창 오픈
const onDeliveryConfirmed = (deliveryInfo) => {
  showCheckoutDialog.value = false
  pendingDeliveryInfo.value = deliveryInfo
  showPaymentDialog.value = true
}

// 2. 결제창에서 "결제하기" 클릭 시 -> 주문 생성 & 결제 처리
const handlePayment = async (paymentMethod) => {
  if (!pendingDeliveryInfo.value) return
  
  showPaymentDialog.value = false // 일단 닫음 (또는 로딩 표시)
  $q.loading.show({ message: '결제 처리 중...' })
  
  try {
    // 2-1. 주문 생성
    const orderRes = await createOrder({
      memberId: userStore.memberId,
      deliveryMethod: 'SHIPPING',
      ...pendingDeliveryInfo.value 
    })
    
    const orderId = orderRes.data.id
    
    // 2-2. 결제 승인 요청
    await processPayment(orderId, paymentMethod)
    
    $q.notify({ type: 'positive', message: '주문 및 결제가 완료되었습니다.' })
    await cartStore.loadCart() // 장바구니 비우기 확인
    
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: '결제 실패: ' + (e.response?.data?.message || '알 수 없는 오류') })
    // 실패 시 장바구니는 유지됨 (백엔드 로직에 의해)
  } finally {
    $q.loading.hide()
    pendingDeliveryInfo.value = null
  }
}
</script>
