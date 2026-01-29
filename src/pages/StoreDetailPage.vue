<template>
  <q-page class="q-pb-xl">
    <!-- Loading State -->
    <div v-if="isLoadingStore" class="flex flex-center window-height">
      <q-spinner color="primary" size="3em" />
    </div>

    <!-- Error State -->
    <div v-else-if="isErrorStore" class="flex flex-center window-height text-negative">
      Failed to load store information.
    </div>

    <template v-else-if="store">
      <!-- Gallery / Cover -->
      <div class="relative-position">
        <q-carousel
          v-if="portfolioImages.length > 0"
          v-model="slide"
          animated
          arrows
          navigation
          infinite
          height="250px"
          class="bg-grey-2"
        >
          <q-carousel-slide
            v-for="(img, index) in portfolioImages"
            :key="index"
            :name="index"
            :img-src="img"
          />
        </q-carousel>
        <q-img
          v-else
          src="https://cdn.quasar.dev/img/parallax2.jpg"
          height="250px"
          class="bg-grey-2"
        >
          <div class="absolute-bottom text-subtitle1 text-center">
            Store Portfolio
          </div>
        </q-img>
      </div>

      <!-- Store Header Info -->
      <div class="q-px-md q-pt-md">
        <div class="row items-center justify-between no-wrap">
          <h1 class="text-h5 text-weight-bold q-my-none">{{ store.name }}</h1>
          <div class="column items-end">
            <div class="row items-center text-orange">
              <q-icon name="star" />
              <span class="text-weight-bold q-ml-xs">4.8</span>
              <span class="text-grey text-caption q-ml-xs">(120)</span>
            </div>
            <div v-if="store.distance" class="text-caption text-grey">
              {{ formatDistance(store.distance) }}
            </div>
          </div>
        </div>

        <div class="q-mt-sm text-body2 text-grey-8">
            {{ store.description }}
        </div>

        <!-- Info List -->
        <q-list class="q-mt-md">
          <q-item clickable v-ripple class="q-px-none">
            <q-item-section avatar min-width="40px">
              <q-icon name="place" color="primary" />
            </q-item-section>
            <q-item-section>{{ store.address }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple class="q-px-none">
            <q-item-section avatar min-width="40px">
              <q-icon name="access_time" color="primary" />
            </q-item-section>
            <q-item-section>
              <div>{{ store.openTime }} - {{ store.closeTime }}</div>
              <div v-if="store.closedDays.length" class="text-caption text-red">
                Closed: {{ store.closedDays.join(', ') }}
              </div>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="q-px-none" tag="a" :href="'tel:' + store.phone">
            <q-item-section avatar min-width="40px">
              <q-icon name="phone" color="primary" />
            </q-item-section>
            <q-item-section>{{ store.phone }}</q-item-section>
          </q-item>
        </q-list>

        <!-- Action Buttons -->
        <div class="row q-gutter-sm q-mt-md">
          <q-btn
            color="primary"
            icon="call"
            label="Call"
            class="col"
            outline
            :href="'tel:' + store.phone"
          />
          <q-btn
            color="primary"
            icon="directions"
            label="Directions"
            class="col"
          />
        </div>
      </div>

      <q-separator class="q-my-lg" size="8px" color="grey-2" />

      <!-- Products Section -->
      <div class="q-px-md">
        <h2 class="text-h6 text-weight-bold q-mb-md">Products</h2>

        <!-- Filters (Simple implementation) -->
        <div class="row q-gutter-sm q-mb-md">
            <q-chip clickable :selected="filter === 'all'" @click="filter = 'all'" color="primary" text-color="white" label="All" />
            <q-chip clickable :selected="filter === 'flower'" @click="filter = 'flower'" outline color="primary" label="Flowers" />
            <q-chip clickable :selected="filter === 'plant'" @click="filter = 'plant'" outline color="primary" label="Plants" />
        </div>

        <div v-if="isLoadingProducts" class="row justify-center q-py-md">
             <q-spinner color="primary" size="2em" />
        </div>
        
        <div v-else-if="products && products.length > 0" class="row q-col-gutter-md">
            <div v-for="product in products" :key="product.id" class="col-6 col-sm-4 col-md-3">
                <q-card class="cursor-pointer full-height" @click="$router.push(`/products/${product.id}`)">
                    <q-img :src="product.thumbnailUrl || 'https://placehold.co/300'" ratio="1" />
                    <q-card-section class="q-pa-sm">
                        <div class="text-subtitle2 ellipsis">{{ product.name }}</div>
                        <div class="text-weight-bold text-primary">{{ formatPrice(product.price) }}</div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
        <div v-else class="text-center text-grey q-py-lg">
            No products found.
        </div>
      </div>

      <q-separator class="q-my-lg" size="8px" color="grey-2" />

      <!-- Reviews Placeholder -->
      <div class="q-px-md q-pb-md">
        <div class="row items-center justify-between q-mb-md">
             <h2 class="text-h6 text-weight-bold q-my-none">Reviews</h2>
             <q-btn flat color="primary" label="See All" />
        </div>
        <div class="bg-grey-1 q-pa-md text-center rounded-borders">
            Reviews coming soon (Phase 3)
        </div>
      </div>

    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { getStore } from 'src/api/store';
import { getProductsByStore } from 'src/api/product';

const route = useRoute();
const storeId = Number(route.params.storeId);

const slide = ref(0);
const filter = ref('all');

// Mock images for gallery since API doesn't provide them yet
const portfolioImages = ref([
    'https://cdn.quasar.dev/img/parallax1.jpg',
    'https://cdn.quasar.dev/img/parallax2.jpg'
]);

const { data: store, isLoading: isLoadingStore, isError: isErrorStore } = useQuery({
    queryKey: ['store', storeId],
    queryFn: () => getStore(storeId),
    enabled: !!storeId
});

const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['store-products', storeId],
    queryFn: () => getProductsByStore(storeId),
    enabled: !!storeId
});

const products = computed(() => {
    if (!productsData.value) return [];
    // Basic frontend filtering
    if (filter.value === 'all') return productsData.value;
    // Assuming backend returns a 'category' field. If not, this won't filter anything effectively or needs adjustment.
    // Based on ProductSchema: category is optional string.
    return productsData.value.filter(p => p.category?.toLowerCase().includes(filter.value));
});


const formatDistance = (meters?: number) => {
    if (!meters) return '';
    if (meters < 1000) return `${meters}m`;
    return `${(meters / 1000).toFixed(1)}km`;
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
};
</script>
