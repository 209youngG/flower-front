<template>
  <q-dialog v-model="isOpen" transition-show="scale" transition-hide="scale">
    <q-card class="size-guide-modal" style="width: 700px; max-width: 90vw; border-radius: 24px; overflow: hidden;">
      
      <!-- Header -->
      <div class="modal-header q-px-lg q-pt-lg q-pb-md row items-center justify-between">
        <div>
          <div class="text-overline text-accent q-mb-none tracking-wide">FLOWER GUIDE</div>
          <h2 class="text-h4 text-weight-bold q-my-none text-primary font-serif">Choose Your Size</h2>
        </div>
        <q-btn icon="close" flat round dense v-close-popup color="grey-7" />
      </div>

      <!-- Main Content -->
      <q-card-section class="q-px-none q-pt-none">
        <q-tabs
          v-model="activeTab"
          class="text-grey-7"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
          dense
        >
          <q-tab name="visual" label="Visual Comparison" icon="visibility" />
          <q-tab name="details" label="Details & Specs" icon="straighten" />
        </q-tabs>

        <q-separator color="grey-2" />

        <q-tab-panels v-model="activeTab" animated class="bg-transparent q-pa-md" style="min-height: 350px;">
          
          <!-- Visual Tab -->
          <q-tab-panel name="visual" class="q-px-sm">
            <div class="row q-col-gutter-md justify-center items-end" style="height: 280px;">
              <div 
                v-for="(size, index) in sizeOptions" 
                :key="size.code"
                class="col-3 column items-center cursor-pointer size-column"
                @click="selectSize(size.code)"
                :class="{'selected-size': selectedSize === size.code}"
              >
                <!-- Visual Representation -->
                <div 
                  class="bouquet-visual relative-position"
                  :style="{ 
                    width: size.visualSize + 'px', 
                    height: size.visualSize + 'px',
                    opacity: selectedSize && selectedSize !== size.code ? 0.5 : 1
                  }"
                >
                  <div class="bouquet-bloom"></div>
                  <div class="bouquet-glow"></div>
                </div>

                <!-- Label -->
                <div class="text-center q-mt-md">
                  <div class="text-weight-bold text-h6 text-primary">{{ size.code }}</div>
                  <div class="text-caption text-grey-8">{{ size.recShort }}</div>
                </div>
                
                <!-- Selection Indicator -->
                <transition name="scale">
                  <div v-if="selectedSize === size.code" class="selection-dot q-mt-sm"></div>
                </transition>
              </div>
            </div>
            
            <!-- Context Text -->
            <transition name="fade" mode="out-in">
              <div class="text-center q-mt-lg text-grey-8" :key="selectedSize || 'none'">
                <div v-if="selectedSize" class="selected-info">
                  <span class="text-weight-bold">{{ getSelectedInfo.name }}</span> recommended for 
                  <span class="text-accent text-weight-medium">{{ getSelectedInfo.recommendation }}</span>
                </div>
                <div v-else class="text-caption text-italic">Select a size to see recommendations</div>
              </div>
            </transition>
          </q-tab-panel>

          <!-- Details Tab -->
          <q-tab-panel name="details" class="q-px-lg">
            <q-list separator padding>
              <q-item 
                v-for="size in sizeOptions" 
                :key="size.code"
                clickable
                v-ripple
                @click="selectSize(size.code)"
                :active="selectedSize === size.code"
                active-class="bg-pink-1"
                class="rounded-borders q-mb-sm"
              >
                <q-item-section avatar>
                  <q-avatar :color="selectedSize === size.code ? 'primary' : 'grey-3'" text-color="white" font-size="14px">
                    {{ size.code }}
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ size.name }}</q-item-label>
                  <q-item-label caption>{{ size.recommendation }}</q-item-label>
                </q-item-section>

                <q-item-section side class="text-right">
                  <q-badge color="secondary" outline class="q-mb-xs">{{ size.height }}</q-badge>
                  <div class="text-caption text-grey-7">{{ size.count }} flowers</div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <!-- Footer Actions -->
      <q-card-actions align="between" class="q-px-lg q-pb-lg bg-grey-1">
        <div class="price-indicator text-subtitle1" v-if="selectedSize">
           Est. Price: <span class="text-weight-bold text-primary">{{ getSelectedInfo.priceRange }}</span>
        </div>
        <div v-else class="text-caption text-grey">Select a size</div>

        <div class="row q-gutter-sm">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn 
            unelevated 
            color="primary" 
            :label="selectedSize ? `Select ${selectedSize}` : 'Choose Size'" 
            class="q-px-xl btn-rounded"
            :disable="!selectedSize"
            @click="confirmSelection"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  initialSize?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'select', size: string): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const activeTab = ref('visual');
const selectedSize = ref(props.initialSize || '');

interface SizeOption {
  code: string;
  name: string;
  height: string;
  count: string;
  recommendation: string;
  recShort: string;
  visualSize: number; // pixel size for circle
  priceRange: string;
}

const sizeOptions: SizeOption[] = [
  { 
    code: 'S', 
    name: 'Small', 
    height: '30-40cm', 
    count: '10-15', 
    recommendation: 'Perfect for a casual gift or self-care.', 
    recShort: '1 Person',
    visualSize: 60,
    priceRange: '₩35,000 - ₩50,000'
  },
  { 
    code: 'M', 
    name: 'Medium', 
    height: '40-50cm', 
    count: '20-30', 
    recommendation: 'Ideal for birthdays and anniversaries.', 
    recShort: 'Anniversary',
    visualSize: 90,
    priceRange: '₩55,000 - ₩80,000'
  },
  { 
    code: 'L', 
    name: 'Large', 
    height: '50-60cm', 
    count: '35-50', 
    recommendation: 'For significant milestones and special days.', 
    recShort: 'Special Day',
    visualSize: 120,
    priceRange: '₩85,000 - ₩120,000'
  },
  { 
    code: 'XL', 
    name: 'Extra Large', 
    height: '60cm+', 
    count: '60+', 
    recommendation: 'Grand gestures for weddings or big events.', 
    recShort: 'Grand Event',
    visualSize: 150,
    priceRange: '₩130,000+'
  },
];

const getSelectedInfo = computed(() => {
  return sizeOptions.find(s => s.code === selectedSize.value) || sizeOptions[0];
});

const selectSize = (code: string) => {
  selectedSize.value = code;
};

const confirmSelection = () => {
  if (selectedSize.value) {
    emit('select', selectedSize.value);
    isOpen.value = false;
  }
};
</script>

<style scoped lang="scss">
.font-serif {
  font-family: 'Playfair Display', Georgia, serif;
}

.modal-header {
  background: linear-gradient(to right, #fff5f8, #ffffff);
}

.bouquet-visual {
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ffcdd2, #e57373);
  position: relative;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 20px rgba(229, 115, 115, 0.2);
  
  &::after {
    content: '';
    position: absolute;
    top: 5%;
    left: 10%;
    width: 20%;
    height: 20%;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
  }
}

.bouquet-bloom {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 50%;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.4) 10%, transparent 10%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 15%, transparent 15%);
}

.size-column:hover .bouquet-visual {
  transform: scale(1.05) translateY(-5px);
  box-shadow: 0 15px 30px rgba(229, 115, 115, 0.3);
}

.selected-size .bouquet-visual {
  background: radial-gradient(circle at 30% 30%, #f48fb1, #d81b60);
  box-shadow: 0 15px 35px rgba(216, 27, 96, 0.4);
  transform: scale(1.1);
}

.selection-dot {
  width: 8px;
  height: 8px;
  background-color: #d81b60;
  border-radius: 50%;
}

.btn-rounded {
  border-radius: 12px;
}

/* Transitions */
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.2s ease;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
