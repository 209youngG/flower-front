<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div v-for="product in products" :key="product.id" class="col-xs-6 col-sm-4 col-md-3">
        <q-card>
          <q-img :src="product.thumbnailUrl || 'https://cdn.quasar.dev/img/parallax2.jpg'" :ratio="1" />
          
          <q-card-section>
            <div class="text-h6 ellipsis">{{ product.name }}</div>
            <div class="text-subtitle2 text-red text-weight-bold">{{ product.price.toLocaleString() }}원</div>
            <div class="text-caption text-grey">재고: {{ product.stockQuantity }}</div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat round color="primary" icon="add" @click="handleRestock(product)">
              <q-tooltip>50개 입고</q-tooltip>
            </q-btn>
            <q-btn flat round color="secondary" icon="shopping_cart" @click="handleAddToCart(product)" :disable="product.stockQuantity < 1" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
    
    <div v-if="loading" class="flex flex-center q-pa-lg">
      <q-spinner color="primary" size="3em" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProducts, restockProduct } from 'src/api/product'
import { useCartStore } from 'stores/cart-store'
import { useQuasar } from 'quasar'

const products = ref([])
const loading = ref(false)
const cartStore = useCartStore()
const $q = useQuasar()

const loadProducts = async () => {
  loading.value = true
  try {
    const res = await getProducts()
    products.value = res.data
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
    await cartStore.addItem(product.id, 1)
    $q.notify({ type: 'positive', message: '장바구니에 담았습니다' })
  } catch (e) {
    $q.notify({ type: 'negative', message: e.message || '장바구니 담기 실패' })
  }
}

onMounted(() => {
  loadProducts()
})
</script>
