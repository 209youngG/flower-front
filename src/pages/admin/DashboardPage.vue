<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">대시보드</div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="text-h6">총 상품 수</div>
            <div class="text-h3">{{ stats.productCount }}</div>
          </q-card-section>
        </q-card>
      </div>
      <!-- 추가 통계 카드들 -->
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProducts } from 'src/api/product'

const stats = ref({
  productCount: 0
})

onMounted(async () => {
  try {
    const res = await getProducts()
    stats.value.productCount = res.data.length
  } catch (e) {
    console.error(e)
  }
})
</script>
