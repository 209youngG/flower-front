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
  try {
    await cartStore.addItem(product.id, product.uiQuantity)
    $q.notify({ type: 'positive', message: '장바구니에 담았습니다' })
  } catch (e) {
    $q.notify({ type: 'negative', message: e.message || '장바구니 담기 실패' })
  }
}

const handleDirectOrder = async (product) => {
  try {
    const res = await createDirectOrder({
      memberId: userStore.memberId,
      productId: product.id,
      quantity: product.uiQuantity,
      deliveryMethod: 'SHIPPING',
      deliveryAddress: '서울시 강남구 테헤란로 (빠른주문)',
      deliveryPhone: '010-1234-5678',
      deliveryName: userStore.user?.name || '홍길동',
      deliveryNote: '문 앞에 부탁드려요'
    })
    
    currentOrderId.value = res.data.id
    showPaymentDialog.value = true
    
  } catch (e) {
    $q.notify({ type: 'negative', message: '주문 생성 실패' })
  }
}

const onPaymentCompleted = async () => {
  await loadProducts()
}

onMounted(() => {
  loadProducts()
})
</script>
