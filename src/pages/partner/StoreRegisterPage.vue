<template>
  <q-page class="q-pa-md flex flex-center bg-grey-1">
    <q-card style="width: 100%; max-width: 600px;">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">매장 등록</div>
        <div class="text-subtitle2">새로운 매장을 파트너로 등록합니다</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <!-- 매장명 -->
          <q-input
            v-model="form.name"
            label="매장명 *"
            filled
            :error="!!errors.name"
            :error-message="errors.name"
          />

          <!-- 주소 검색 -->
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-8">
              <q-input
                v-model="form.address"
                label="주소 *"
                filled
                readonly
                @click="openAddressSearch"
                :error="!!errors.address"
                :error-message="errors.address"
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer" @click="openAddressSearch" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-sm-4">
              <q-btn
                label="주소 검색"
                color="secondary"
                class="full-width full-height"
                outline
                @click="openAddressSearch"
              />
            </div>
          </div>

          <!-- 위치 (위도/경도) -->
          <div class="text-subtitle2 q-mt-sm">매장 위치 *</div>
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input
                v-model.number="form.lat"
                label="위도 (Lat)"
                filled
                type="number"
                step="any"
                :error="!!errors.lat"
                :error-message="errors.lat"
              />
            </div>
            <div class="col-6">
              <q-input
                v-model.number="form.lon"
                label="경도 (Lon)"
                filled
                type="number"
                step="any"
                :error="!!errors.lon"
                :error-message="errors.lon"
              />
            </div>
          </div>
          <div class="row justify-end q-mb-sm">
            <q-btn
              icon="my_location"
              label="현재 위치 가져오기"
              flat
              color="primary"
              size="sm"
              @click="getCurrentLocation"
            />
          </div>

          <!-- 전화번호 -->
          <q-input
            v-model="form.phone"
            label="전화번호 *"
            filled
            mask="###-####-####"
            unmasked-value
            hint="'-' 없이 입력 가능"
            :error="!!errors.phone"
            :error-message="errors.phone"
          />

          <!-- 영업 시간 -->
          <div class="text-subtitle2 q-mt-md">영업 시간 *</div>
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input
                v-model="form.openTime"
                label="오픈 시간"
                filled
                mask="time"
                :rules="['time']"
                :error="!!errors.openTime"
                :error-message="errors.openTime"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="form.openTime">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-6">
              <q-input
                v-model="form.closeTime"
                label="마감 시간"
                filled
                mask="time"
                :rules="['time']"
                :error="!!errors.closeTime"
                :error-message="errors.closeTime"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="form.closeTime">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>

          <!-- 휴무일 -->
          <div class="q-mt-sm">
            <div class="text-subtitle2 q-mb-xs">정기 휴무일</div>
            <div class="q-gutter-sm">
              <q-checkbox v-model="form.closedDays" val="MONDAY" label="월" />
              <q-checkbox v-model="form.closedDays" val="TUESDAY" label="화" />
              <q-checkbox v-model="form.closedDays" val="WEDNESDAY" label="수" />
              <q-checkbox v-model="form.closedDays" val="THURSDAY" label="목" />
              <q-checkbox v-model="form.closedDays" val="FRIDAY" label="금" />
              <q-checkbox v-model="form.closedDays" val="SATURDAY" label="토" />
              <q-checkbox v-model="form.closedDays" val="SUNDAY" label="일" color="red" />
            </div>
          </div>

          <!-- 매장 설명 -->
          <q-input
            v-model="form.description"
            label="매장 설명 *"
            filled
            type="textarea"
            rows="4"
            hint="매장의 특징이나 소개글을 입력해주세요 (10자 이상)"
            :error="!!errors.description"
            :error-message="errors.description"
          />

          <!-- Actions -->
          <div class="row q-mt-lg">
            <q-space />
            <q-btn label="취소" flat color="grey" class="q-mr-sm" to="/partner/dashboard" />
            <q-btn label="등록하기" type="submit" color="primary" :loading="loading" size="lg" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { createStore, CreateStoreSchema, type CreateStoreRequest } from 'src/api/store';

const router = useRouter();
const $q = useQuasar();

// 폼 데이터
const form = reactive<CreateStoreRequest>({
  name: '',
  address: '',
  phone: '',
  lat: 0,
  lon: 0,
  description: '',
  openTime: '09:00',
  closeTime: '20:00',
  closedDays: []
});

// 에러 상태
const errors = reactive<Record<string, string>>({});
const loading = ref(false);

// Daum Postcode 스크립트 로드
const loadDaumPostcode = () => {
  const script = document.createElement('script');
  script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  script.async = true;
  document.head.appendChild(script);
};

onMounted(() => {
  loadDaumPostcode();
});

// 주소 검색 함수
const openAddressSearch = () => {
  // @ts-expect-error Daum Postcode is loaded dynamically
  if (!window.daum || !window.daum.Postcode) {
    $q.notify({ type: 'warning', message: '주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.' });
    return;
  }

  // @ts-expect-error Daum Postcode is loaded dynamically
  new window.daum.Postcode({
    oncomplete: function(data: any) {
      // 주소 선택 시 처리
      form.address = data.address; // 기본 주소
      
      // 건물명이 있는 경우 추가
      if (data.buildingName) {
        form.address += ` (${data.buildingName})`;
      }
    }
  }).open();
};

// 현재 위치 가져오기
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    $q.notify({ type: 'negative', message: '브라우저가 위치 정보를 지원하지 않습니다.' });
    return;
  }

  $q.loading.show({ message: '위치 정보를 가져오는 중...' });
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      form.lat = position.coords.latitude;
      form.lon = position.coords.longitude;
      $q.loading.hide();
      $q.notify({ type: 'positive', message: '현재 위치를 적용했습니다.' });
    },
    (error) => {
      console.error(error);
      $q.loading.hide();
      $q.notify({ type: 'negative', message: '위치 정보를 가져오는데 실패했습니다.' });
    }
  );
};

// 폼 제출
const onSubmit = async () => {
  // 에러 초기화
  Object.keys(errors).forEach(key => delete errors[key]);

  // Zod 검증
  const result = CreateStoreSchema.safeParse(form);
  
  if (!result.success) {
    // 검증 실패 시 에러 메시지 매핑
    result.error.issues.forEach(issue => {
      const field = issue.path[0].toString();
      errors[field] = issue.message;
    });
    
    $q.notify({ type: 'negative', message: '입력 정보를 확인해주세요.' });
    return;
  }

  loading.value = true;
  try {
    await createStore(form);
    $q.notify({
      type: 'positive',
      message: '매장이 성공적으로 등록되었습니다.'
    });
    router.push('/partner/dashboard');
  } catch (error: any) {
    console.error(error);
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || '매장 등록에 실패했습니다.'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.q-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>