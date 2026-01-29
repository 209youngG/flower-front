<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row q-col-gutter-md justify-center">
      <div class="col-12 col-md-8">
        <!-- Header & Controls -->
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h5 q-mb-md text-weight-bold text-primary">Find a Flower Shop</div>
            
            <div class="row q-col-gutter-sm items-center">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="searchKeyword"
                  outlined
                  dense
                  placeholder="Search by store name..."
                  clearable
                  @clear="searchKeyword = ''"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              
              <div class="col-12 col-sm-6 flex justify-between items-center">
                <div class="q-gutter-sm">
                  <span class="text-grey-7">Radius:</span>
                  <q-btn-dropdown outline dense color="primary" :label="`${radius} km`">
                    <q-list>
                      <q-item clickable v-close-popup @click="radius = 1">
                        <q-item-section>1 km</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="radius = 3">
                        <q-item-section>3 km</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="radius = 5">
                        <q-item-section>5 km</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="radius = 10">
                        <q-item-section>10 km</q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </div>
                
                <q-btn-toggle
                  v-model="viewMode"
                  push
                  glossy
                  toggle-color="primary"
                  :options="[
                    { label: 'List', value: 'list', icon: 'list' },
                    { label: 'Map', value: 'map', icon: 'map' }
                  ]"
                />
              </div>
            </div>
          </q-card-section>
          
          <q-separator />
          
          <q-card-section v-if="locationError" class="bg-red-1 text-red">
            <q-icon name="warning" class="q-mr-sm" />
            {{ locationError }}
            <q-btn flat label="Retry" size="sm" class="q-ml-sm" @click="getLocation" />
          </q-card-section>
          
          <q-card-section v-if="locationLoading" class="text-center text-grey">
            <q-spinner-dots size="2em" />
            <div class="q-mt-sm">Acquiring location...</div>
          </q-card-section>
        </q-card>

        <!-- Content Area -->
        <div v-if="!locationLoading && userLocation">
          
          <!-- Loading State for Stores -->
          <div v-if="isLoading" class="row justify-center q-my-xl">
            <q-spinner-grid color="primary" size="3em" />
          </div>

          <!-- Error State -->
          <div v-else-if="isError" class="text-center q-pa-lg">
            <q-icon name="error_outline" size="4em" color="negative" />
            <p class="text-grey-7 q-mt-md">Failed to load nearby stores.</p>
            <q-btn color="primary" label="Retry" @click="refetch" />
          </div>

          <!-- Stores Data -->
          <div v-else>
            <!-- View: List -->
            <div v-if="viewMode === 'list'">
              <div v-if="stores?.length === 0" class="text-center q-pa-xl text-grey-6">
                <q-icon name="storefront" size="4em" />
                <p class="q-mt-md">No stores found within {{ radius }}km.</p>
              </div>

              <div class="row q-col-gutter-md">
                <div v-for="store in stores" :key="store.id" class="col-12 col-sm-6">
                  <q-card class="store-card h-full cursor-pointer hover-effect" @click="$router.push(`/stores/${store.id}`)">
                    <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" :ratio="16/9" style="height: 140px">
                      <div class="absolute-bottom text-subtitle2 flex justify-between items-center">
                        <span>{{ store.name }}</span>
                        <q-chip size="sm" color="white" text-color="primary" icon="place">
                          {{ formatDistance(store.distance) }}
                        </q-chip>
                      </div>
                    </q-img>

                    <q-card-section>
                      <div class="row items-center no-wrap">
                        <div class="col">
                          <div class="text-caption text-grey">{{ store.address }}</div>
                        </div>
                      </div>
                      <div class="q-mt-sm text-grey-8 text-caption ellipsis-2-lines">
                        {{ store.description }}
                      </div>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions align="right">
                      <q-btn flat round color="primary" icon="phone" :href="`tel:${store.phone}`" @click.stop />
                      <q-btn flat color="primary" label="Visit" />
                    </q-card-actions>
                  </q-card>
                </div>
              </div>
            </div>

            <!-- View: Map -->
            <div v-else class="map-container relative-position">
              <q-card class="fit">
                 <div id="kakao-map" style="width: 100%; height: 500px;" class="bg-grey-3 flex flex-center">
                    <div v-if="!mapLoaded" class="text-center">
                      <q-icon name="map" size="3em" color="grey-5" />
                      <p class="text-grey-6">Map View (Kakao Map Integration Required)</p>
                      <p class="text-caption">Use List view to see details</p>
                    </div>
                 </div>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getNearbyStores } from 'src/api/store';
import type { StoreWithDistance } from 'src/api/store';
import { useQuasar } from 'quasar';

// --- State ---
const $q = useQuasar();
const searchKeyword = ref('');
const radius = ref(5); // Default 5km
const viewMode = ref<'list' | 'map'>('list');
const locationLoading = ref(true);
const locationError = ref<string | null>(null);
const userLocation = ref<{ lat: number; lon: number } | null>(null);
const mapLoaded = ref(false);

// --- Geolocation ---
const getLocation = () => {
  locationLoading.value = true;
  locationError.value = null;

  if (!navigator.geolocation) {
    locationError.value = "Geolocation is not supported by your browser.";
    locationLoading.value = false;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation.value = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      };
      locationLoading.value = false;
    },
    (error) => {
      console.error("Geolocation error:", error);
      locationError.value = "Unable to retrieve your location. Please enable GPS.";
      locationLoading.value = false;
      // Fallback to a default location (e.g., Seoul) for demo purposes if needed
      // userLocation.value = { lat: 37.5665, lon: 126.9780 }; 
    }
  );
};

// --- Data Fetching ---
const { data: stores, isLoading, isError, refetch } = useQuery({
  queryKey: ['nearbyStores', userLocation, radius, searchKeyword],
  queryFn: () => {
    if (!userLocation.value) return Promise.resolve([]);
    return getNearbyStores(
      userLocation.value.lat,
      userLocation.value.lon,
      radius.value,
      searchKeyword.value || undefined
    );
  },
  enabled: () => !!userLocation.value,
  staleTime: 1000 * 60 * 5, // 5 minutes
});

// --- Helpers ---
const formatDistance = (dist?: number) => {
  if (dist === undefined) return '';
  return dist < 1 ? `${(dist * 1000).toFixed(0)}m` : `${dist.toFixed(1)}km`;
};

// --- Lifecycle ---
onMounted(() => {
  getLocation();
});

</script>

<style lang="scss" scoped>
.store-card {
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
}
.map-container {
  height: 500px;
}
</style>
