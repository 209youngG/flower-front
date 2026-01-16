<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div v-for="product in products" :key="product.id" class="col-xs-6 col-sm-4 col-md-3">
        <q-card>
          <q-img :src="product.thumbnailUrl || 'https://cdn.quasar.dev/img/parallax2.jpg'" :ratio="1" />
          
          <q-card-section>
            <div class="text-h6 ellipsis">{{ product.name }}</div>
            <div class="text-caption text-grey">재고: {{ product.stockQuantity }}</div>
            
            <div class="row items-center justify-between q-mt-sm">
              <div class="text-subtitle2 text-red text-weight-bold">{{ product.price.toLocaleString() }}원</div>
              
              <div class="row items-center bg-grey-2 rounded-borders">
                <q-btn flat round dense icon="remove" size="xs" 
                  @click="product.uiQuantity > 1 ? product.uiQuantity-- : null" 
                  :disable="product.uiQuantity <= 1" />
                <div class="q-px-sm text-caption">{{ product.uiQuantity }}</div>
                <q-btn flat round dense icon="add" size="xs" 
                  @click="product.uiQuantity < product.stockQuantity ? product.uiQuantity++ : null" 
                  :disable="product.uiQuantity >= product.stockQuantity" />
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn 
              v-if="userStore.isProductAdmin"
              flat round color="primary" icon="add" 
              @click="handleRestock(product)"
            >
              <q-tooltip>50개 입고</q-tooltip>
            </q-btn>
            <q-btn flat round color="secondary" icon="shopping_cart" @click="handleAddToCart(product)" :disable="product.stockQuantity < 1">
              <q-tooltip>장바구니 담기</q-tooltip>
            </q-btn>
            <q-btn flat round color="accent" icon="bolt" @click="handleDirectOrder(product)" :disable="product.stockQuantity < 1">
              <q-tooltip>바로 구매</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    
    <div v-if="loading" class="flex flex-center q-pa-lg">
      <q-spinner color="primary" size="3em" />
    </div>

    <!-- 옵션 선택 다이얼로그 -->
    <q-dialog v-model="optionDialog.show">
      <q-card style="width: 400px">
        <q-card-section>
          <div class="text-h6">{{ optionDialog.product?.name }}</div>
          <div class="text-subtitle2 text-grey">옵션을 선택해주세요</div>
        </q-card-section>

        <q-card-section>
          <!-- 옵션이 있는 경우 -->
          <div v-if="optionDialog.product?.options && optionDialog.product.options.length > 0">
            <div v-for="opt in optionDialog.product.options" :key="opt.id" class="q-mb-sm">
              <q-checkbox 
                v-model="optionDialog.selectedOptionIds" 
                :val="opt.id" 
                :label="`${opt.name}: ${opt.optionValue} (+${opt.priceAdjustment.toLocaleString()}원)`" 
              />
            </div>
          </div>
          <!-- 옵션이 없는 경우 -->
          <div v-else class="text-center text-grey q-py-md">
            선택 가능한 옵션이 없습니다.
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="취소" v-close-popup />
          <q-btn flat label="확인" color="primary" @click="confirmOptions" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <CheckoutDialog v-model="showCheckoutDialog" @confirm="confirmDirectOrder" />
    <PaymentDialog v-model="showPaymentDialog" :orderId="currentOrderId" @completed="onPaymentCompleted" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProducts, restockProduct } from 'src/api/product'
import { createDirectOrder } from 'src/api/order'
import { useCartStore } from 'stores/cart-store'
import { useUserStore } from 'stores/user-store'
import { useQuasar } from 'quasar'
import PaymentDialog from 'components/PaymentDialog.vue'

const products = ref([])
const loading = ref(false)
const cartStore = useCartStore()
const userStore = useUserStore()
const $q = useQuasar()

const showPaymentDialog = ref(false)
const currentOrderId = ref(0)
const optionDialog = ref({
  show: false,
  product: null,
  actionType: '', // 'CART' or 'ORDER'
  selectedOptionIds: []
})

const loadProducts = async () => {
  loading.value = true
  try {
    const res = await getProducts()
    products.value = res.data.map(p => ({ ...p, uiQuantity: 1 }))
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: '상품 목록 로딩 실패' })
  } finally {
    loading.value = false
  }
}

const handleRestock = async (product) => {
  try {
    await restockProduct(product.id, 50)
    $q.notify({ type: 'positive', message: '50개 입고 완료' })
    await loadProducts()
  } catch (e) {
    $q.notify({ type: 'negative', message: '입고 실패' })
  }
}

const handleAddToCart = async (product) => {
  if (!userStore.isAuthenticated) {
    $q.notify({ type: 'warning', message: '로그인이 필요한 기능입니다.' })
    return
  }

  // 옵션이 있으면 다이얼로그 띄우기
  if (product.options && product.options.length > 0) {
    optionDialog.value = {
      show: true,
      product: product,
      actionType: 'CART',
      selectedOptionIds: []
    }
  } else {
    // 옵션 없으면 바로 처리
    processAddToCart(product, [])
  }
}

const processAddToCart = async (product, optionIds) => {
  try {
    // cartStore.addItem이 옵션 ID 리스트를 지원하도록 수정됨
    await cartStore.addItem(product.id, product.uiQuantity, optionIds)
    $q.notify({ type: 'positive', message: '장바구니에 담았습니다' })
  } catch (e) {
    $q.notify({ type: 'negative', message: e.message || '장바구니 담기 실패' })
  }
}

const handleDirectOrder = async (product) => {
  if (!userStore.isAuthenticated) {
    $q.notify({ type: 'warning', message: '로그인이 필요한 기능입니다.' })
    return
  }

  if (product.options && product.options.length > 0) {
    optionDialog.value = {
      show: true,
      product: product,
      actionType: 'ORDER',
      selectedOptionIds: []
    }
  } else {
    processDirectOrder(product, [])
  }
}

import CheckoutDialog from 'components/CheckoutDialog.vue'

// ...

const showCheckoutDialog = ref(false)
const pendingOrderData = ref(null) // 주문 대기 데이터 (상품, 수량 등)

// ...

const processDirectOrder = async (product, optionIds) => {
  // 바로 API를 호출하지 않고 배송지 선택 다이얼로그를 띄움
  pendingOrderData.value = {
    productId: product.id,
    quantity: product.uiQuantity,
    optionIds: optionIds
  }
  showCheckoutDialog.value = true
}

const confirmDirectOrder = async (deliveryInfo) => {
  showCheckoutDialog.value = false
  if (!pendingOrderData.value) return

  try {
    const res = await createDirectOrder({
      memberId: userStore.memberId,
      productId: pendingOrderData.value.productId,
      quantity: pendingOrderData.value.quantity,
      optionIds: pendingOrderData.value.optionIds,
      deliveryMethod: 'SHIPPING',
      ...deliveryInfo // 주소 정보 병합
    })
    
    currentOrderId.value = res.data.id
    showPaymentDialog.value = true
    
  } catch (e) {
    $q.notify({ type: 'negative', message: '주문 생성 실패' })
  }
}

const confirmOptions = () => {
// ...
  const { product, actionType, selectedOptionIds } = optionDialog.value
  if (actionType === 'CART') {
    processAddToCart(product, selectedOptionIds)
  } else if (actionType === 'ORDER') {
    processDirectOrder(product, selectedOptionIds)
  }
  optionDialog.value.show = false
}

const onPaymentCompleted = async () => {
  await loadProducts()
}

onMounted(() => {
  loadProducts()
})
</script>
