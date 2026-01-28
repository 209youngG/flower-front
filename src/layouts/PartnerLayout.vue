<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated class="bg-chic text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="drawer = !drawer" />
        <q-toolbar-title>Flori Partner Center</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above bordered class="bg-grey-1">
      <q-list>
        <q-item-label header>Menu</q-item-label>

        <q-item clickable v-ripple to="/partner/store">
          <q-item-section avatar>
            <q-icon name="store" />
          </q-item-section>
          <q-item-section>Store Mgmt</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/partner/orders">
          <q-item-section avatar>
            <q-icon name="receipt_long" />
          </q-item-section>
          <q-item-section>Orders</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/partner/flower">
          <q-item-section avatar>
            <q-icon name="local_florist" />
          </q-item-section>
          <q-item-section>Today's Flower</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(true)
</script>
