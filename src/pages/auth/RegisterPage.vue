<template>
  <q-page class="flex flex-center">
    <q-card style="width: 400px; max-width: 90vw;">
      <q-card-section>
        <div class="text-h6">회원가입</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input v-model="email" label="이메일" type="email" filled :rules="[val => !!val || '이메일을 입력해주세요']" />
          <q-input v-model="password" label="비밀번호" type="password" filled :rules="[val => !!val || '비밀번호를 입력해주세요']" />
          <q-input v-model="name" label="이름" filled :rules="[val => !!val || '이름을 입력해주세요']" />
          <q-input v-model="phoneNumber" label="전화번호" filled :rules="[val => !!val || '전화번호를 입력해주세요']" />
          
          <div class="text-subtitle2 q-mt-md">주소 정보 (선택)</div>
          <div class="row q-col-gutter-sm">
            <div class="col-4">
              <q-input v-model="zipCode" label="우편번호" filled />
            </div>
            <div class="col-8">
              <q-btn label="주소 검색" color="grey-3" text-color="black" class="full-width full-height" disable>
                <q-tooltip>추후 구현 예정</q-tooltip>
              </q-btn>
            </div>
          </div>
          <q-input v-model="address" label="기본 주소" filled />
          <q-input v-model="detailAddress" label="상세 주소" filled />

          <div>
            <q-btn label="가입하기" type="submit" color="primary" class="full-width" />
            <q-btn label="취소" flat class="full-width q-mt-sm" to="/auth/login" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user-store'
import { useQuasar } from 'quasar'

const email = ref('')
const password = ref('')
const name = ref('')
const phoneNumber = ref('')
const zipCode = ref('')
const address = ref('')
const detailAddress = ref('')

const userStore = useUserStore()
const router = useRouter()
const $q = useQuasar()

const onSubmit = async () => {
  try {
    await userStore.register({
      email: email.value,
      password: password.value,
      name: name.value,
      phoneNumber: phoneNumber.value,
      zipCode: zipCode.value,
      address: address.value,
      detailAddress: detailAddress.value
    })
    $q.notify({ type: 'positive', message: '가입 성공! 로그인되었습니다.' })
    router.push('/')
  } catch (e) {
    $q.notify({ type: 'negative', message: '가입 실패: 이미 존재하는 이메일이거나 오류가 발생했습니다.' })
  }
}
</script>
