<template>
  <q-page padding>
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h6">상품 관리</div>
      <q-btn color="primary" label="상품 등록" icon="add" @click="openDialog()" />
    </div>

    <q-table
      :rows="products"
      :columns="columns"
      row-key="id"
      :loading="loading"
    >
      <template v-slot:body-cell-thumbnail="props">
        <q-td :props="props">
          <q-img :src="props.row.thumbnailUrl || 'https://cdn.quasar.dev/img/parallax2.jpg'" style="width: 50px; height: 50px" />
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round icon="edit" color="primary" @click="openDialog(props.row)" />
          <q-btn flat round icon="delete" color="negative" @click="confirmDelete(props.row)" />
        </q-td>
      </template>
    </q-table>

    <!-- 상품 등록/수정 다이얼로그 -->
    <q-dialog v-model="dialogOpen">
      <q-card style="width: 500px">
        <q-card-section>
          <div class="text-h6">{{ isEdit ? '상품 수정' : '상품 등록' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input v-model="form.name" label="상품명" filled :rules="[val => !!val || '필수 입력']" />
            <q-input v-model.number="form.price" label="가격" type="number" filled :rules="[val => val >= 0 || '0 이상 입력']" />
            <q-input v-model.number="form.stockQuantity" label="재고" type="number" filled />
            <q-select 
              v-model="form.category" 
              :options="categoryOptions" 
              label="카테고리" 
              filled 
              emit-value 
              map-options 
            />
            <q-select 
              v-model="form.deliveryType" 
              :options="deliveryOptions" 
              label="배송 타입" 
              filled 
              emit-value 
              map-options 
              :rules="[val => !!val || '배송 타입을 선택해주세요']"
            />
            <q-input v-model="form.thumbnailUrl" label="썸네일 URL" filled />
            <q-input v-model="form.description" label="설명" type="textarea" filled />
            
            <div class="q-mt-md">
              <div class="text-subtitle2 q-mb-sm">옵션 관리</div>
              <div v-for="(opt, idx) in form.options" :key="idx" class="row q-col-gutter-sm items-center q-mb-sm">
                <div class="col-5">
                  <q-input v-model="opt.name" label="옵션명" dense filled />
                </div>
                <div class="col-3">
                  <q-input v-model="opt.value" label="옵션값" dense filled />
                </div>
                <div class="col-3">
                  <q-input v-model.number="opt.priceAdjustment" label="가격조정" type="number" dense filled />
                </div>
                <div class="col-1">
                  <q-btn icon="remove" color="negative" flat dense round @click="removeOption(idx)" />
                </div>
              </div>
              <q-btn label="옵션 추가" icon="add" flat color="primary" @click="addOption" />
            </div>

            <div class="row justify-end q-mt-md">
              <q-btn label="취소" flat v-close-popup />
              <q-btn :label="isEdit ? '수정' : '등록'" type="submit" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getProducts, createProduct, updateProduct, deleteProduct } from 'src/api/product'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const products = ref([])
const loading = ref(false)
const dialogOpen = ref(false)
const form = ref({ id: null, name: '', price: 0, stockQuantity: 0, category: 'FLOWER_BOUQUET', thumbnailUrl: '', description: '', options: [] })

const categoryOptions = [
  { label: '꽃다발', value: 'FLOWER_BOUQUET' },
  { label: '꽃선물', value: 'FLOWER_GIFT' },
  { label: '개업화분', value: 'OPENING_PLANT' },
  { label: '승진/취임', value: 'PROMOTION_APPOINTMENT' },
  { label: '결혼/장례', value: 'WEDDING_FUNERAL' },
  { label: '트렌드픽', value: 'TREND_PICK' },
  { label: 'DIY 꽃시장', value: 'DIY_FLOWER_MARKET' },
  { label: '정기구독', value: 'SUBSCRIPTION' },
  { label: '오늘도착', value: 'SAME_DAY_DELIVERY' }
]

const deliveryOptions = [
  { label: '퀵배송', value: 'QUICK' },
  { label: '택배배송', value: 'PARCEL' },
  { label: '혼합', value: 'MIXED' }
]

const isEdit = computed(() => !!form.value.id)

const columns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'thumbnail', label: '이미지', field: 'thumbnail', align: 'center' },
  { name: 'name', label: '상품명', field: 'name', sortable: true, align: 'left' },
  { name: 'price', label: '가격', field: 'price', sortable: true, format: val => `${val.toLocaleString()}원` },
  { name: 'stockQuantity', label: '재고', field: 'stockQuantity', sortable: true },
  { name: 'actions', label: '관리', field: 'actions', align: 'center' }
]

const loadProducts = async () => {
  loading.value = true
  try {
    const res = await getProducts()
    products.value = res.data
  } catch (e) {
    $q.notify({ type: 'negative', message: '로드 실패' })
  } finally {
    loading.value = false
  }
}

const openDialog = (product = null) => {
  if (product) {
    // 백엔드 DTO(options -> ProductOptionDto)에서 오는 필드는 'optionValue'이지만
    // 등록/수정 요청(CreateProductOptionRequest)에서 기대하는 필드는 'value'임.
    // 따라서 기존 데이터를 불러올 때 'optionValue'를 'value'로 매핑해줘야 함.
    const mappedOptions = (product.options || []).map(opt => ({
      name: opt.name,
      value: opt.optionValue, // 매핑 중요!
      priceAdjustment: opt.priceAdjustment
    }));
    
    // deliveryType이 없는 경우 기본값 설정
    form.value = { ...product, deliveryType: product.deliveryType || 'PARCEL', options: mappedOptions }
  } else {
    form.value = { id: null, name: '', price: 0, stockQuantity: 0, category: 'FLOWER_BOUQUET', deliveryType: 'PARCEL', thumbnailUrl: '', description: '', options: [] }
  }
  dialogOpen.value = true
}

const addOption = () => {
  form.value.options.push({ name: '', value: '', priceAdjustment: 0 })
}

const removeOption = (index) => {
  form.value.options.splice(index, 1)
}

const onSubmit = async () => {
  try {
    if (isEdit.value) {
      await updateProduct(form.value.id, form.value)
      $q.notify({ type: 'positive', message: '수정 완료' })
    } else {
      await createProduct(form.value)
      $q.notify({ type: 'positive', message: '등록 완료' })
    }
    dialogOpen.value = false
    loadProducts()
  } catch (e) {
    $q.notify({ type: 'negative', message: '작업 실패' })
  }
}

const confirmDelete = (product) => {
  $q.dialog({
    title: '삭제 확인',
    message: `${product.name} 상품을 삭제하시겠습니까?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await deleteProduct(product.id)
      $q.notify({ type: 'positive', message: '삭제 완료' })
      loadProducts()
    } catch (e) {
      $q.notify({ type: 'negative', message: '삭제 실패' })
    }
  })
}

onMounted(() => {
  loadProducts()
})
</script>
