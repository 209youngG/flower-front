# Phase 2: Flori Sommelier (AI Curation) - Frontend 작업 계획서 🎨

**시작일:** TBD  
**목표 완료일:** TBD (예상 11일)  
**전제조건:** ✅ Phase 1 완료 (O2O Platform Base)  
**개발 원칙:** 🔴 **모든 코드는 TDD로 작성** (Red-Green-Refactor)

---

## 🎯 Phase 2 Frontend 목표

**UX 목표:**
- "꽃을 잘 몰라도 완벽한 선택" - 4단계 마법사 UI
- Chat-like 경험 - 친구와 대화하듯 자연스러운 플로우
- 감성적인 결과 페이지 - 꽃말 카드로 스토리텔링
- AI 메시지로 감동 더하기 - 3종 메시지 중 선택

**핵심 화면:**
1. Sommelier Wizard (4 Steps)
2. Curation Result (추천 결과)
3. AI Message Generator (메시지 생성)

---

## 📋 프론트엔드 작업 목록

### 🔴 1. Sommelier Wizard (소믈리에 마법사)

#### 1.1 Step 1: Who (대상 선택)

**파일:** `src/pages/curation/steps/WhoStep.vue`

**UI 디자인:**
- 카드 선택 방식 (6개 카드 2×3 그리드)
- 각 카드: 아이콘 + 텍스트 + 설명
- 선택 시 하이라이트 (테두리 + 그림자)

**선택지:**
1. 💑 연인 - "사랑하는 사람에게"
2. 👨‍👩‍👧 부모님 - "감사의 마음을 전하고 싶어요"
3. 👥 친구 - "소중한 친구에게"
4. 💼 동료 - "함께 일하는 분께"
5. 👨‍🏫 선생님/멘토 - "은사님께 감사를"
6. ❓ 기타 - "직접 입력"

**작업 단계:**

- [ ] **TDD: Step 1 (Red)** - `WhoStep.spec.ts` 작성
  ```typescript
  import { describe, it, expect } from 'vitest'
  import { mount } from '@vue/test-utils'
  import WhoStep from '../WhoStep.vue'
  
  describe('WhoStep', () => {
    it('should render 6 option cards', () => {
      const wrapper = mount(WhoStep)
      expect(wrapper.findAll('.who-card')).toHaveLength(6)
    })
    
    it('should emit selected value when card clicked', async () => {
      const wrapper = mount(WhoStep)
      await wrapper.find('.who-card[data-value="연인"]').trigger('click')
      
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0]).toEqual(['연인'])
    })
    
    it('should highlight selected card', async () => {
      const wrapper = mount(WhoStep, {
        props: { modelValue: '연인' }
      })
      
      const selectedCard = wrapper.find('.who-card[data-value="연인"]')
      expect(selectedCard.classes()).toContain('selected')
    })
  })
  ```

- [ ] **Step 2 (Green)** - 컴포넌트 구현
  ```vue
  <script setup lang="ts">
  import { computed } from 'vue'
  
  interface Props {
    modelValue?: string
  }
  
  interface Emits {
    (e: 'update:modelValue', value: string): void
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()
  
  const options = [
    { value: '연인', icon: '💑', label: '연인', description: '사랑하는 사람에게' },
    { value: '부모님', icon: '👨‍👩‍👧', label: '부모님', description: '감사의 마음을 전하고 싶어요' },
    { value: '친구', icon: '👥', label: '친구', description: '소중한 친구에게' },
    { value: '동료', icon: '💼', label: '동료', description: '함께 일하는 분께' },
    { value: '선생님', icon: '👨‍🏫', label: '선생님/멘토', description: '은사님께 감사를' },
    { value: '기타', icon: '❓', label: '기타', description: '직접 입력' }
  ]
  
  const selectWho = (value: string) => {
    emit('update:modelValue', value)
  }
  
  const isSelected = (value: string) => props.modelValue === value
  </script>
  
  <template>
    <div class="who-step">
      <h2 class="text-h5 q-mb-md">누구에게 선물하시나요?</h2>
      
      <div class="row q-col-gutter-md">
        <div 
          v-for="option in options" 
          :key="option.value"
          class="col-6 col-md-4"
        >
          <q-card
            :class="['who-card', { selected: isSelected(option.value) }]"
            :data-value="option.value"
            @click="selectWho(option.value)"
            flat
            bordered
          >
            <q-card-section class="text-center">
              <div class="text-h3 q-mb-sm">{{ option.icon }}</div>
              <div class="text-h6">{{ option.label }}</div>
              <div class="text-caption text-grey-7">{{ option.description }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped lang="scss">
  .who-card {
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }
    
    &.selected {
      border-color: $primary;
      border-width: 2px;
      box-shadow: 0 4px 16px rgba(233, 30, 99, 0.3);
    }
  }
  </style>
  ```

- [ ] **Step 3 (Refactor)** - 애니메이션 추가
  - Stagger 등장 효과
  - 선택 시 Ripple 효과

---

#### 1.2 Step 2: Why (상황 선택)

**파일:** `src/pages/curation/steps/WhyStep.vue`

**UI 디자인:**
- 다중 선택 가능 (최소 1개)
- Chip 버튼 형태
- 선택된 항목: Primary 색상

**선택지:**
1. 🎂 생일
2. 💝 기념일
3. 💕 고백
4. 🤗 위로
5. 🎉 축하/승진
6. 🙏 감사
7. 😢 사과
8. 💪 쾌유

**작업 단계:**

- [ ] **TDD: Step 1 (Red)** - `WhyStep.spec.ts`
  ```typescript
  describe('WhyStep', () => {
    it('should allow multiple selections', async () => {
      const wrapper = mount(WhyStep)
      
      await wrapper.find('[data-value="생일"]').trigger('click')
      await wrapper.find('[data-value="감사"]').trigger('click')
      
      expect(wrapper.emitted('update:modelValue')[1]).toEqual([['생일', '감사']])
    })
    
    it('should require at least one selection', () => {
      const wrapper = mount(WhyStep, {
        props: { modelValue: [] }
      })
      
      expect(wrapper.find('.validation-error').exists()).toBe(true)
    })
  })
  ```

- [ ] **Step 2 (Green)** - 구현
  ```vue
  <script setup lang="ts">
  import { computed } from 'vue'
  
  interface Props {
    modelValue: string[]
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits<{ (e: 'update:modelValue', value: string[]): void }>()
  
  const occasions = [
    { value: '생일', icon: '🎂', label: '생일' },
    { value: '기념일', icon: '💝', label: '기념일' },
    { value: '고백', icon: '💕', label: '고백' },
    { value: '위로', icon: '🤗', label: '위로' },
    { value: '축하', icon: '🎉', label: '축하/승진' },
    { value: '감사', icon: '🙏', label: '감사' },
    { value: '사과', icon: '😢', label: '사과' },
    { value: '쾌유', icon: '💪', label: '쾌유' }
  ]
  
  const toggleOccasion = (value: string) => {
    const current = [...props.modelValue]
    const index = current.indexOf(value)
    
    if (index > -1) {
      current.splice(index, 1)
    } else {
      current.push(value)
    }
    
    emit('update:modelValue', current)
  }
  
  const isSelected = (value: string) => props.modelValue.includes(value)
  const isValid = computed(() => props.modelValue.length > 0)
  </script>
  
  <template>
    <div class="why-step">
      <h2 class="text-h5 q-mb-md">어떤 상황인가요? (여러 개 선택 가능)</h2>
      
      <div class="row q-col-gutter-sm q-mb-md">
        <div v-for="occasion in occasions" :key="occasion.value" class="col-auto">
          <q-chip
            :data-value="occasion.value"
            :selected="isSelected(occasion.value)"
            :color="isSelected(occasion.value) ? 'primary' : 'grey-3'"
            :text-color="isSelected(occasion.value) ? 'white' : 'grey-8'"
            clickable
            @click="toggleOccasion(occasion.value)"
            size="lg"
          >
            <span class="q-mr-xs">{{ occasion.icon }}</span>
            {{ occasion.label }}
          </q-chip>
        </div>
      </div>
      
      <div v-if="!isValid" class="validation-error text-negative text-caption">
        최소 1개 이상 선택해주세요
      </div>
    </div>
  </template>
  ```

- [ ] **Step 3 (Refactor)** - 조합 추천
  - "생일 + 감사" 선택 시 "생일 축하와 감사의 마음" 힌트 표시

---

#### 1.3 Step 3: Vibe (분위기 + 컬러)

**파일:** `src/pages/curation/steps/VibeStep.vue`

**UI 디자인:**
- Vibe 선택: 4개 큰 카드
- 각 Vibe별 대표 컬러 표시
- 커스텀 컬러: Quasar Color Picker (선택사항)

**Vibe 옵션:**
1. 🌸 Lovely - 사랑스러운 (#FFB6C1 Light Pink)
2. 🌺 Vivid - 화사한 (#FF6B9D Hot Pink)
3. 🖤 Chic - 세련된 (#2C2C54 Dark Blue)
4. 🌿 Natural - 자연스러운 (#A8E6CF Mint Green)

**작업 단계:**

- [ ] **TDD: Step 1 (Red)** - `VibeStep.spec.ts`
  ```typescript
  describe('VibeStep', () => {
    it('should emit vibe and color when vibe selected', async () => {
      const wrapper = mount(VibeStep)
      await wrapper.find('[data-vibe="LOVELY"]').trigger('click')
      
      expect(wrapper.emitted('update:vibe')).toEqual([['LOVELY']])
      expect(wrapper.emitted('update:color')).toEqual([['#FFB6C1']])
    })
    
    it('should allow custom color selection', async () => {
      const wrapper = mount(VibeStep, {
        props: { vibe: 'LOVELY' }
      })
      
      await wrapper.find('.custom-color-btn').trigger('click')
      // Color picker should be visible
      expect(wrapper.find('.q-color-picker').isVisible()).toBe(true)
    })
  })
  ```

- [ ] **Step 2 (Green)** - 구현
  ```vue
  <script setup lang="ts">
  import { ref } from 'vue'
  
  type Vibe = 'LOVELY' | 'VIVID' | 'CHIC' | 'NATURAL'
  
  interface Props {
    vibe?: Vibe
    color?: string
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits<{
    (e: 'update:vibe', value: Vibe): void
    (e: 'update:color', value: string): void
  }>()
  
  const vibes = [
    { value: 'LOVELY' as Vibe, icon: '🌸', label: '사랑스러운', color: '#FFB6C1' },
    { value: 'VIVID' as Vibe, icon: '🌺', label: '화사한', color: '#FF6B9D' },
    { value: 'CHIC' as Vibe, icon: '🖤', label: '세련된', color: '#2C2C54' },
    { value: 'NATURAL' as Vibe, icon: '🌿', label: '자연스러운', color: '#A8E6CF' }
  ]
  
  const showColorPicker = ref(false)
  const customColor = ref(props.color || '#FFB6C1')
  
  const selectVibe = (vibe: Vibe, color: string) => {
    emit('update:vibe', vibe)
    emit('update:color', color)
    showColorPicker.value = false
  }
  
  const selectCustomColor = () => {
    emit('update:color', customColor.value)
  }
  </script>
  
  <template>
    <div class="vibe-step">
      <h2 class="text-h5 q-mb-md">어떤 분위기를 원하시나요?</h2>
      
      <div class="row q-col-gutter-md q-mb-lg">
        <div v-for="vibeOption in vibes" :key="vibeOption.value" class="col-6">
          <q-card
            :class="['vibe-card', { selected: vibe === vibeOption.value }]"
            :data-vibe="vibeOption.value"
            :style="{ borderColor: vibeOption.color }"
            @click="selectVibe(vibeOption.value, vibeOption.color)"
            flat
            bordered
          >
            <q-card-section class="text-center">
              <div class="text-h3 q-mb-sm">{{ vibeOption.icon }}</div>
              <div class="text-h6">{{ vibeOption.label }}</div>
              <div 
                class="color-preview q-mt-md" 
                :style="{ backgroundColor: vibeOption.color }"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
      
      <q-separator class="q-my-md" />
      
      <div class="custom-color-section">
        <q-btn
          class="custom-color-btn"
          label="선호하는 색상 직접 선택 (선택사항)"
          icon="palette"
          flat
          @click="showColorPicker = !showColorPicker"
        />
        
        <q-color
          v-if="showColorPicker"
          v-model="customColor"
          class="q-mt-md"
          @change="selectCustomColor"
        />
      </div>
    </div>
  </template>
  
  <style scoped lang="scss">
  .vibe-card {
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
    }
    
    &.selected {
      border-width: 3px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
  }
  
  .color-preview {
    height: 40px;
    border-radius: 8px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  </style>
  ```

---

#### 1.4 Step 4: Budget (예산 설정)

**파일:** `src/pages/curation/steps/BudgetStep.vue`

**UI 디자인:**
- 슬라이더 (1만원 ~ 20만원, 1만원 단위)
- 프리셋 버튼: 3만원, 5만원, 10만원
- 실시간 금액 표시

**작업 단계:**

- [ ] **TDD: Step 1 (Red)** - `BudgetStep.spec.ts`
  ```typescript
  describe('BudgetStep', () => {
    it('should emit budget when slider changed', async () => {
      const wrapper = mount(BudgetStep)
      const slider = wrapper.findComponent({ name: 'QSlider' })
      
      await slider.vm.$emit('update:modelValue', 50000)
      
      expect(wrapper.emitted('update:modelValue')).toEqual([[50000]])
    })
    
    it('should set preset value when preset button clicked', async () => {
      const wrapper = mount(BudgetStep)
      await wrapper.find('[data-preset="50000"]').trigger('click')
      
      expect(wrapper.emitted('update:modelValue')).toEqual([[50000]])
    })
  })
  ```

- [ ] **Step 2 (Green)** - 구현
  ```vue
  <script setup lang="ts">
  import { computed } from 'vue'
  
  interface Props {
    modelValue: number
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits<{ (e: 'update:modelValue', value: number): void }>()
  
  const presets = [
    { label: '3만원대', value: 30000 },
    { label: '5만원대', value: 50000 },
    { label: '10만원대', value: 100000 }
  ]
  
  const formattedBudget = computed(() => {
    return new Intl.NumberFormat('ko-KR').format(props.modelValue) + '원'
  })
  
  const setPreset = (value: number) => {
    emit('update:modelValue', value)
  }
  </script>
  
  <template>
    <div class="budget-step">
      <h2 class="text-h5 q-mb-md">예산을 설정해주세요</h2>
      
      <div class="budget-display text-center q-mb-lg">
        <div class="text-h3 text-primary">{{ formattedBudget }}</div>
      </div>
      
      <q-slider
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
        :min="10000"
        :max="200000"
        :step="10000"
        label
        :label-value="formattedBudget"
        color="primary"
        class="q-mb-xl"
      />
      
      <div class="preset-buttons row q-col-gutter-sm justify-center">
        <div v-for="preset in presets" :key="preset.value" class="col-auto">
          <q-btn
            :data-preset="preset.value"
            :label="preset.label"
            :outline="modelValue !== preset.value"
            :unelevated="modelValue === preset.value"
            color="primary"
            @click="setPreset(preset.value)"
            size="lg"
          />
        </div>
      </div>
      
      <div class="q-mt-lg text-caption text-grey-7 text-center">
        💡 추천 예산: 관계에 따라 3만원~10만원대가 적당합니다
      </div>
    </div>
  </template>
  ```

---

#### 1.5 Wizard Container (마법사 컨테이너)

**파일:** `src/pages/curation/CurationWizardPage.vue`

**기능:**
- 4 Steps 관리
- Progress Bar
- 이전/다음 버튼
- 최종 제출 (API 호출)

**작업 단계:**

- [ ] **TDD: Step 1 (Red)** - `CurationWizardPage.spec.ts`
  ```typescript
  describe('CurationWizardPage', () => {
    it('should start at step 1', () => {
      const wrapper = mount(CurationWizardPage)
      expect(wrapper.find('h2').text()).toContain('누구에게')
    })
    
    it('should disable next button when step incomplete', () => {
      const wrapper = mount(CurationWizardPage)
      expect(wrapper.find('.next-btn').attributes('disabled')).toBeDefined()
    })
    
    it('should navigate to next step when next clicked', async () => {
      const wrapper = mount(CurationWizardPage)
      // Select '연인'
      await wrapper.find('[data-value="연인"]').trigger('click')
      await wrapper.find('.next-btn').trigger('click')
      
      expect(wrapper.find('h2').text()).toContain('어떤 상황')
    })
    
    it('should submit request on final step', async () => {
      const wrapper = mount(CurationWizardPage)
      // Fill all steps...
      await wrapper.find('.submit-btn').trigger('click')
      
      expect(wrapper.emitted('submit')).toBeTruthy()
    })
  })
  ```

- [ ] **Step 2 (Green)** - 구현
  ```vue
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useMutation } from '@tanstack/vue-query'
  import { getCurationRecommendations } from 'src/api/curation'
  import WhoStep from './steps/WhoStep.vue'
  import WhyStep from './steps/WhyStep.vue'
  import VibeStep from './steps/VibeStep.vue'
  import BudgetStep from './steps/BudgetStep.vue'
  
  const router = useRouter()
  
  const step = ref(1)
  const formData = ref({
    who: '',
    why: [] as string[],
    vibe: '' as any,
    color: '',
    budget: 50000
  })
  
  const canProceed = computed(() => {
    switch (step.value) {
      case 1: return !!formData.value.who
      case 2: return formData.value.why.length > 0
      case 3: return !!formData.value.vibe
      case 4: return formData.value.budget >= 10000
      default: return false
    }
  })
  
  const { mutate: submitCuration, isPending } = useMutation({
    mutationFn: getCurationRecommendations,
    onSuccess: (data) => {
      router.push({
        name: 'curation-result',
        state: { result: data }
      })
    }
  })
  
  const nextStep = () => {
    if (step.value < 4) {
      step.value++
    } else {
      // Final submit
      submitCuration(formData.value)
    }
  }
  
  const prevStep = () => {
    if (step.value > 1) {
      step.value--
    }
  }
  </script>
  
  <template>
    <q-page class="curation-wizard-page q-pa-md">
      <q-stepper
        v-model="step"
        vertical
        color="primary"
        animated
        header-nav
      >
        <q-step
          :name="1"
          title="대상 선택"
          icon="person"
          :done="step > 1"
        >
          <WhoStep v-model="formData.who" />
        </q-step>
        
        <q-step
          :name="2"
          title="상황 선택"
          icon="favorite"
          :done="step > 2"
        >
          <WhyStep v-model="formData.why" />
        </q-step>
        
        <q-step
          :name="3"
          title="분위기 & 컬러"
          icon="palette"
          :done="step > 3"
        >
          <VibeStep 
            v-model:vibe="formData.vibe"
            v-model:color="formData.color"
          />
        </q-step>
        
        <q-step
          :name="4"
          title="예산 설정"
          icon="attach_money"
        >
          <BudgetStep v-model="formData.budget" />
        </q-step>
        
        <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn
              v-if="step < 4"
              class="next-btn"
              label="다음"
              color="primary"
              :disable="!canProceed"
              @click="nextStep"
            />
            <q-btn
              v-else
              class="submit-btn"
              label="추천 받기"
              color="primary"
              :loading="isPending"
              :disable="!canProceed"
              @click="nextStep"
            />
            
            <q-btn
              v-if="step > 1"
              label="이전"
              flat
              @click="prevStep"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </q-page>
  </template>
  ```

- [ ] **Step 3 (Refactor)** - 진행상황 저장
  - LocalStorage에 임시 저장
  - 페이지 새로고침 시 복원

---

### 🔴 2. Curation Result Page (추천 결과)

#### 2.1 Result Page Container

**파일:** `src/pages/curation/CurationResultPage.vue`

**레이아웃:**
1. 헤더: "AI가 추천하는 완벽한 꽃"
2. Best Seller 섹션
3. Storytelling 섹션 (꽃말 카드)
4. Smart Choice 섹션

**작업 단계:**

- [ ] **TDD: Step 1 (Red)** - `CurationResultPage.spec.ts`
  ```typescript
  describe('CurationResultPage', () => {
    it('should display all three sections', () => {
      const wrapper = mount(CurationResultPage, {
        props: {
          result: mockCurationResult
        }
      })
      
      expect(wrapper.find('.best-seller-section').exists()).toBe(true)
      expect(wrapper.find('.storytelling-section').exists()).toBe(true)
      expect(wrapper.find('.smart-choice-section').exists()).toBe(true)
    })
    
    it('should show empty state when no products', () => {
      const wrapper = mount(CurationResultPage, {
        props: {
          result: { bestSeller: [], storytelling: [], smartChoice: [] }
        }
      })
      
      expect(wrapper.find('.empty-state').text()).toContain('추천 상품이 없습니다')
    })
  })
  ```

- [ ] **Step 2 (Green)** - 구현 (너무 길어서 핵심만)
  ```vue
  <script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { useQuery } from '@tanstack/vue-query'
  import RecommendationCard from './components/RecommendationCard.vue'
  import FlowerLanguageCard from './components/FlowerLanguageCard.vue'
  
  const route = useRoute()
  const requestId = route.query.requestId as string
  
  // Route state에서 결과 가져오기 (Wizard에서 전달)
  const result = history.state.result
  </script>
  
  <template>
    <q-page class="curation-result-page">
      <div class="page-header q-pa-md text-center">
        <h1 class="text-h4">✨ AI가 추천하는 완벽한 꽃</h1>
        <p class="text-subtitle1">당신의 마음을 전할 특별한 선택</p>
      </div>
      
      <!-- Best Seller -->
      <section class="best-seller-section q-pa-md">
        <h2 class="text-h5 q-mb-md">🏆 실패 없는 선택</h2>
        <div class="row q-col-gutter-md">
          <div v-for="product in result.bestSeller" :key="product.id" class="col-12 col-md-4">
            <RecommendationCard :product="product" badge="베스트셀러" />
          </div>
        </div>
      </section>
      
      <!-- Storytelling -->
      <section class="storytelling-section q-pa-md bg-pink-1">
        <h2 class="text-h5 q-mb-md">💌 마음을 담은 추천</h2>
        <div class="row q-col-gutter-md">
          <div v-for="product in result.storytelling" :key="product.id" class="col-12 col-md-4">
            <RecommendationCard :product="product" badge="꽃말 매칭" />
          </div>
        </div>
        
        <!-- 꽃말 카드 -->
        <div class="flower-languages q-mt-lg">
          <h3 class="text-h6 q-mb-md">🌸 이런 의미를 담았어요</h3>
          <div class="row q-col-gutter-sm">
            <div v-for="fl in result.flowerLanguages" :key="fl.id" class="col-6 col-md-3">
              <FlowerLanguageCard :flower-language="fl" />
            </div>
          </div>
        </div>
      </section>
      
      <!-- Smart Choice -->
      <section class="smart-choice-section q-pa-md">
        <h2 class="text-h5 q-mb-md">💰 가성비 추천</h2>
        <div class="row q-col-gutter-md">
          <div v-for="product in result.smartChoice" :key="product.id" class="col-12 col-md-4">
            <RecommendationCard :product="product" badge="가성비" />
          </div>
        </div>
      </section>
    </q-page>
  </template>
  ```

---

#### 2.2 Recommendation Card

**파일:** `src/pages/curation/components/RecommendationCard.vue`

- [ ] **TDD + 구현** (생략 - 표준 Product Card 패턴)

---

#### 2.3 Flower Language Card

**파일:** `src/pages/curation/components/FlowerLanguageCard.vue`

**기능:**
- Flip 애니메이션 (앞면: 꽃 이미지, 뒷면: 꽃말)
- 공유하기 버튼

- [ ] **TDD: Step 1 (Red)** - `FlowerLanguageCard.spec.ts`
  ```typescript
  describe('FlowerLanguageCard', () => {
    it('should flip card on click', async () => {
      const wrapper = mount(FlowerLanguageCard, {
        props: { flowerLanguage: mockFlowerLanguage }
      })
      
      expect(wrapper.find('.card-front').isVisible()).toBe(true)
      
      await wrapper.find('.flip-card').trigger('click')
      
      expect(wrapper.find('.card-back').isVisible()).toBe(true)
    })
  })
  ```

- [ ] **Step 2 (Green)** - 구현 (Flip 애니메이션 CSS)

---

### 🔴 3. AI Message Generator (메시지 생성)

#### 3.1 Message Generator Dialog

**파일:** `src/components/MessageGeneratorDialog.vue`

**트리거:** CheckoutDialog에서 "AI로 작성하기" 버튼

**플로우:**
1. 톤앤매너 선택 (격식, 캐주얼, 로맨틱)
2. API 호출 (로딩 3초)
3. 3종 메시지 Chip으로 표시
4. 선택 시 부모로 emit

**작업 단계:**

- [ ] **TDD + 구현**
- [ ] CheckoutDialog 통합

---

### 🔴 4. API Integration

#### 4.1 Curation API Client

**파일:** `src/api/curation.ts`

```typescript
import axios from 'axios'
import { z } from 'zod'

// Schemas
export const CurationRequestSchema = z.object({
  who: z.string(),
  why: z.array(z.string()).min(1),
  vibe: z.enum(['LOVELY', 'VIVID', 'CHIC', 'NATURAL']),
  budget: z.number().min(10000).max(200000),
  color: z.string().optional()
})

export const CurationResultSchema = z.object({
  bestSeller: z.array(ProductSchema),
  storytelling: z.array(ProductSchema),
  smartChoice: z.array(ProductSchema),
  flowerLanguages: z.array(FlowerLanguageSchema),
  recommendationReason: z.string()
})

export type CurationRequest = z.infer<typeof CurationRequestSchema>
export type CurationResult = z.infer<typeof CurationResultSchema>

// API Functions
export async function getCurationRecommendations(
  request: CurationRequest
): Promise<CurationResult> {
  const { data } = await axios.post('/api/v1/curation/recommend', request)
  return CurationResultSchema.parse(data)
}

export async function generateMessages(
  request: MessageRequest
): Promise<string[]> {
  const { data } = await axios.post('/api/v1/curation/message', request)
  return z.array(z.string()).parse(data)
}
```

- [ ] **TDD: API 스키마 테스트** (`curation.spec.ts`)

---

#### 4.2 TanStack Query Composables

**파일:** `src/composables/useCuration.ts`

```typescript
import { useMutation, useQuery } from '@tanstack/vue-query'
import { getCurationRecommendations, generateMessages } from 'src/api/curation'

export function useCurationQuery() {
  return useQuery({
    queryKey: ['curation'],
    queryFn: () => {}, // Not used directly
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

export function useCurationMutation() {
  return useMutation({
    mutationFn: getCurationRecommendations
  })
}

export function useMessageGeneratorMutation() {
  return useMutation({
    mutationFn: generateMessages
  })
}
```

---

### 🟡 5. Additional Features

#### 5.1 홈 화면 CTA

**파일:** `src/pages/IndexPage.vue` 수정

- [ ] 상단에 큰 CTA 배너 추가
  ```vue
  <q-banner class="curation-cta bg-gradient-pink q-mb-lg">
    <template v-slot:avatar>
      <q-icon name="auto_awesome" size="xl" />
    </template>
    <div class="text-h6">AI가 추천하는 완벽한 꽃 찾기</div>
    <div class="text-subtitle2">4단계만 답하면 당신의 마음을 전할 꽃을 찾아드려요</div>
    <q-btn 
      label="지금 시작하기 ✨" 
      color="white" 
      text-color="primary"
      size="lg"
      unelevated
      to="/curation/wizard"
      class="q-mt-md"
    />
  </q-banner>
  ```

---

#### 5.2 Routing 설정

**파일:** `src/router/routes.js`

```javascript
{
  path: '/curation',
  component: () => import('layouts/MainLayout.vue'),
  children: [
    {
      path: 'wizard',
      name: 'curation-wizard',
      component: () => import('pages/curation/CurationWizardPage.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: 'result',
      name: 'curation-result',
      component: () => import('pages/curation/CurationResultPage.vue')
    }
  ]
}
```

---

## 📅 Frontend 일정 (11일)

| 일정 | 작업 | 완료 |
|------|------|------|
| Day 1-2 | Step 1-4 컴포넌트 (TDD) | [ ] |
| Day 3 | Wizard Container | [ ] |
| Day 4-5 | Result Page | [ ] |
| Day 6 | Flower Language Card | [ ] |
| Day 7 | AI Message Generator | [ ] |
| Day 8 | API Integration | [ ] |
| Day 9 | 홈 화면 통합 | [ ] |
| Day 10 | 애니메이션 & UX 개선 | [ ] |
| Day 11 | 테스트 & 버그 수정 | [ ] |

---

## ✅ Definition of Done

1. 🔴 **Red**: 테스트 먼저 작성
2. 🟢 **Green**: 컴포넌트 구현
3. 🔵 **Refactor**: 코드 개선
4. ✅ **모든 테스트 통과**
5. ✅ **Mobile Responsive 확인**
6. ✅ **Git Commit (한글)**

---

**🎨 Flori Sommelier Frontend, 시작합니다!**
