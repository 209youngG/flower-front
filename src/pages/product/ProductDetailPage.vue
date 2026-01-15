<template>
  <q-page padding>
    <div v-if="loading" class="flex flex-center window-height">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="product" class="row q-col-gutter-lg">
      <!-- 상품 이미지 섹션 -->
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-img 
            :src="product.thumbnailUrl || 'https://cdn.quasar.dev/img/parallax2.jpg'" 
            :ratio="1"
            class="rounded-borders"
          >
            <div v-if="!product.isAvailableToday" class="absolute-top-right bg-negative text-white q-pa-xs">
              예약상품
            </div>
          </q-img>
        </q-card>
      </div>

      <!-- 상품 정보 및 옵션 섹션 -->
      <div class="col-12 col-md-6">
        <div class="text-h4 q-mb-md">{{ product.name }}</div>
        <div class="text-h5 text-primary text-weight-bold q-mb-lg">
          {{ product.price.toLocaleString() }}원
        </div>

        <q-separator class="q-mb-md" />

        <!-- 옵션 선택 -->
        <div v-if="options.length > 0" class="q-mb-lg">
          <div class="text-subtitle1 q-mb-sm">옵션 선택</div>
          <div class="row q-col-gutter-sm">
            <div v-for="opt in options" :key="opt.id" class="col-6 col-sm-4">
              <q-btn
                outline
                :color="selectedOption?.id === opt.id ? 'primary' : 'grey'"
                class="full-width"
                @click="selectedOption = opt"
              >
                <div class="column items-center">
                  <div>{{ opt.optionValue }}</div>
                  <div class="text-caption" v-if="opt.priceAdjustment > 0">
                    (+{{ opt.priceAdjustment.toLocaleString() }}원)
                  </div>
                </div>
              </q-btn>
            </div>
          </div>
        </div>

        <!-- 수량 선택 -->
        <div class="row items-center q-mb-lg">
          <div class="text-subtitle1 q-mr-md">수량</div>
          <div class="row items-center bg-grey-2 rounded-borders">
            <q-btn flat round dense icon="remove" @click="quantity > 1 ? quantity-- : null" />
            <div class="q-px-md text-h6">{{ quantity }}</div>
            <q-btn flat round dense icon="add" @click="quantity++" />
          </div>
        </div>

        <!-- 추가 상품 (Addons) -->
        <div v-if="addons.length > 0" class="q-mb-lg">
          <div class="text-subtitle1 q-mb-sm">함께 구매하면 좋은 상품</div>
          <q-list bordered separator class="rounded-borders">
            <q-item tag="label" v-for="addon in addons" :key="addon.id" v-ripple>
              <q-item-section avatar>
                <q-checkbox v-model="selectedAddons" :val="addon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ addon.name }}</q-item-label>
                <q-item-label caption>{{ addon.description }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                +{{ addon.price.toLocaleString() }}원
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <q-separator class="q-mb-lg" />

        <!-- 총 금액 -->
        <div class="row justify-between items-center q-mb-lg">
          <div class="text-h6">총 결제금액</div>
          <div class="text-h4 text-primary text-weight-bold">
            {{ totalPrice.toLocaleString() }}원
          </div>
        </div>

        <!-- 구매 버튼 -->
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <q-btn 
              outline 
              color="primary" 
              label="장바구니" 
              class="full-width q-py-md text-weight-bold"
              @click="addToCart"
            />
          </div>
          <div class="col-6">
            <q-btn 
              unelevated 
              color="primary" 
              label="바로 구매" 
              class="full-width q-py-md text-weight-bold"
              @click="orderNow"
            />
          </div>
        </div>
      </div>
    </div>
    
    <PaymentDialog v-model="showPaymentDialog" :orderId="createdOrderId" />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { getProduct, getProductOptions, getAddons } from 'src/api/product'
import { createDirectOrder } from 'src/api/order'
import { useUserStore } from 'stores/user-store'
import { useCartStore } from 'stores/cart-store'
import PaymentDialog from 'components/PaymentDialog.vue'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const userStore = useUserStore()
const cartStore = useCartStore()

const loading = ref(true)
const product = ref(null)
const options = ref([])
const addons = ref([])

const quantity = ref(1)
const selectedOption = ref(null)
const selectedAddons = ref([])

const showPaymentDialog = ref(false)
const createdOrderId = ref(null)

const totalPrice = computed(() => {
  if (!product.value) return 0
  
  let base = product.value.price
  
  // 옵션 추가금
  if (selectedOption.value) {
    base += selectedOption.value.priceAdjustment
  }
  
  // 기본 상품 합계
  let total = base * quantity.value
  
  // 추가 상품 합계 (수량 1개로 가정)
  const addonTotal = selectedAddons.value.reduce((sum, addon) => sum + addon.price, 0)
  
  return total + addonTotal
})

const loadData = async () => {
  try {
    const productId = route.params.id
    const [pRes, oRes, aRes] = await Promise.all([
      getProduct(productId),
      getProductOptions(productId),
      getAddons()
    ])
    
    product.value = pRes.data
    options.value = oRes.data
    addons.value = aRes.data
    
    // 첫 번째 옵션 자동 선택
    if (options.value.length > 0) {
      selectedOption.value = options.value[0]
    }
  } catch (e) {
    $q.notify({ type: 'negative', message: '상품 정보를 불러오는데 실패했습니다.' })
    router.push('/products')
  } finally {
    loading.value = false
  }
}

const addToCart = async () => {
  // TODO: 장바구니 API가 옵션/Addon을 지원하도록 수정 필요
  // 현재는 단순 상품 ID만 전송
  try {
    await cartStore.addItem(product.value.id, quantity.value)
    $q.notify({ type: 'positive', message: '장바구니에 담겼습니다.' })
  } catch (e) {
    $q.notify({ type: 'negative', message: '장바구니 담기 실패' })
  }
}

const orderNow = async () => {
  if (!userStore.isAuthenticated) {
    $q.notify({ type: 'warning', message: '로그인이 필요합니다.' })
    router.push('/auth/login')
    return
  }

  try {
    const optionIds = []
    if (selectedOption.value) optionIds.push(selectedOption.value.id)
    // Addon ID는 현재 API 구조상 별도 필드가 필요하거나 optionIds에 통합해야 함
    // 여기서는 optionIds 리스트에 함께 전송한다고 가정 (백엔드가 구분 가능한 경우)
    // 혹은 백엔드 API 수정 필요 (addonIds 필드 추가 등)
    
    const res = await createDirectOrder({
      memberId: userStore.memberId,
      productId: product.value.id,
      quantity: quantity.value,
      optionIds: optionIds, // 선택된 옵션만 전송
      deliveryMethod: 'SHIPPING',
      deliveryAddress: '기본 배송지', // 실제 앱에서는 입력 폼 필요
      deliveryPhone: '010-0000-0000',
      deliveryName: userStore.user.name
    })
    
    createdOrderId.value = res.data.id
    showPaymentDialog.value = true
  } catch (e) {
    $q.notify({ type: 'negative', message: '주문 생성 실패' })
  }
}

onMounted(() => {
  loadData()
})
</script>
