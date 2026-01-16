<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-grey-9 text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>Flower Shop Admin</q-toolbar-title>
        <q-space />
        <q-btn flat round icon="logout" @click="logout">
          <q-tooltip>로그아웃</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-list>
        <q-item-label header>관리 메뉴</q-item-label>

        <q-item clickable v-ripple to="/admin/dashboard" active-class="text-primary bg-blue-1">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>대시보드</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/products" active-class="text-primary bg-blue-1">
          <q-item-section avatar>
            <q-icon name="inventory_2" />
          </q-item-section>
          <q-item-section>상품 관리</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/deliveries" active-class="text-primary bg-blue-1">
          <q-item-section avatar>
            <q-icon name="local_shipping" />
          </q-item-section>
          <q-item-section>배송 관리</q-item-section>
        </q-item>
        
        <q-separator class="q-my-md" />
        
        <q-item clickable v-ripple to="/" exact>
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>쇼핑몰 홈으로</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user-store'

const leftDrawerOpen = ref(false)
const userStore = useUserStore()
const router = useRouter()

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const logout = () => {
  userStore.logout()
  router.push('/auth/login')
}
</script>
