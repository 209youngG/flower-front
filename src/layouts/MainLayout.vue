<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-white text-black">
      <q-toolbar>
        <q-toolbar-title>Flower Shop</q-toolbar-title>
        
        <div v-if="userStore.isAuthenticated">
          <q-btn v-if="userStore.isAdmin" flat round icon="admin_panel_settings" to="/admin" color="negative">
            <q-tooltip>관리자 페이지</q-tooltip>
          </q-btn>
          <span class="q-mr-sm text-subtitle2">{{ userStore.user.name }}님</span>
          <q-btn flat round icon="logout" @click="logout" />
        </div>
        <div v-else>
          <q-btn flat label="로그인" to="/auth/login" />
          <q-btn flat label="회원가입" to="/auth/register" />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer bordered class="bg-white text-primary">
      <q-tabs no-caps active-color="primary" indicator-color="transparent" class="text-grey">
        <q-route-tab name="home" label="홈" icon="home" to="/" exact />
        <q-route-tab name="cart" label="장바구니" icon="shopping_cart" to="/cart" />
        <q-route-tab name="my-orders" label="주문내역" icon="list_alt" to="/my-orders" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { useUserStore } from 'stores/user-store'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const logout = () => {
  userStore.logout()
  router.push('/auth/login')
}
</script>
