<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card style="width: 400px;">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">관리자 로그인</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input v-model="loginId" label="관리자 ID" filled :rules="[val => !!val || 'ID를 입력해주세요']" />
          <q-input v-model="password" label="비밀번호" type="password" filled :rules="[val => !!val || '비밀번호를 입력해주세요']" />
          
          <div>
            <q-btn label="로그인" type="submit" color="primary" class="full-width" />
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

const loginId = ref('')
const password = ref('')
const userStore = useUserStore()
const router = useRouter()
const $q = useQuasar()

const onSubmit = async () => {
  try {
    await userStore.login(loginId.value, password.value)
    
    if (!userStore.isAdmin) {
      $q.notify({ type: 'warning', message: '관리자 계정이 아닙니다.' })
      userStore.logout()
      return
    }

    $q.notify({ type: 'positive', message: '관리자 로그인 성공' })
    router.push('/admin/dashboard')
  } catch (e) {
    $q.notify({ type: 'negative', message: '로그인 실패' })
  }
}
</script>
