<template>
  <!-- 头部组件 -->
  <Header/>
  <!-- 路由视图 -->
  <router-view v-slot="{Component}">
    <!-- 缓存组件,可以让你的地图性能变得更好 -->
    <keep-alive>
      <component :is="Component"></component>
    </keep-alive>
  </router-view>
  <div id="map"></div>
</template>

<script setup>
// 引入mapbox
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import {Scene,Mapbox} from '@antv/l7'
import { onMounted } from 'vue'
import {app} from './main'
import Header from './components/Header.vue'
import {RouterView} from 'vue-router'
onMounted(() => {
  // 在onMounted中初始化地图
  const token = import.meta.env.VITE_TOKEN
  mapboxgl.accessToken = token
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [114.30, 30.50],
    zoom: 2,
    projection: 'globe'
  })
  // 加入L7
  const scene=new Scene({
    id:'map',
    map:new Mapbox({
      mapInstance:map
    }),
    logoVisible:false
  })
  map.on('style.load', () => {
    map.setFog({})
    // 消除边界
  })
  app.provide('$scene_map',{scene,map})
})
</script>

<style scoped>
#map {
  width: 100vw;
  height: 100vh;
}
</style>