<template>
  <div>
    <BottomControl :chartDisplay="chartDisplay" @changeChart="changeChart"/>
    <SmartCity/>
    <MapControl/>
    <G2Chart v-if="chartDisplay"/>
  </div>
</template>

<script setup>
import BottomControl from './BottomControl.vue';
// 场景组件
import SmartCity from './SmartCity.vue';
// 控件组件
import MapControl from './MapControl.vue';
import G2Chart from './G2Chart.vue';
import {ref} from 'vue'

const chartDisplay=ref(true)

const changeChart=(status)=>{
  chartDisplay.value=status
}

</script>
<style scoped>
</style>