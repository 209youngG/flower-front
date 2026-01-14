<template>
  <q-page class="flex flex-center">
    <q-card style="width: 400px; max-width: 90vw;">
      <q-card-section>
        <div class="text-h6">로그인</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input v-model="email" label="이메일" type="email" filled :rules="[val => !!val || '이메일을 입력해주세요']" />
          <q-input v-model="password" label="비밀번호" type="password" filled :rules="[val => !!val || '비밀번호를 입력해주세요']" />
          
          <div>
            <q-btn label="로그인" type="submit" color="primary" class="full-width" />
            <q-btn label="회원가입" flat color="secondary" class="full-width q-mt-sm" to="/auth/register" />
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
const userStore = useUserStore()
const router = useRouter()
const $q = useQuasar()

const onSubmit = async () => {
  try {
    await userStore.login(email.value, password.value)
    $q.notify({ type: 'positive', message: '로그인 성공' })
    router.push('/')
  } catch (e) {
    $q.notify({ type: 'negative', message: '로그인 실패: 이메일 또는 비밀번호를 확인하세요' })
  }
}
</script>
