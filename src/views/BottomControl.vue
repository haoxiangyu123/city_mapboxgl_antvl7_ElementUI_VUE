<template>
    <Footer>
        <div class="btn-groups">
            <div class="item">
                <button class="btn-toggle" @click="controlRotate">
                    <i class="iconfont icon-fuwudiqiu"></i>
                </button>
                <p>{{ mark }}</p>
            </div>
            <div class="item">
                <button class="btn-toggle" @click="toggleControl">
                    <i class="iconfont icon-supervision-full"></i>
                </button>
                <p>控制中心</p>
            </div>
            <div class="item">
                <button class="btn-toggle" @click="flyTo">
                    <i class="iconfont icon-icon-test"></i>
                </button>
                <p>{{ markPosition }}</p>
            </div>

            <DrawTools>
                <div class="item">
                    <button class="btn-toggle">
                        <i class="iconfont icon-paint"></i>
                    </button>
                    <p>事故查询</p>
                </div>
            </DrawTools>
        </div>
    </Footer>
</template>

<script setup>
import Footer from '../components/Footer.vue';
import { ref, computed, inject, onMounted } from 'vue'
import DrawTools from '../components/DrawTools.vue'
const { scene, map } = inject('$scene_map')

// 是否旋转
const isRotate = ref(true)

const mark = computed(() => {
    return isRotate.value ? '停止自转' : '开启自转'
})
// 从父组件中，获取到我们图表组件的显隐情况
const props = defineProps({
    chartDisplay: {
        type: Boolean
    }
})
// 开启地球自转的函数
const rotateEarth = () => {
    // 获取当前的缩放级数
    const zoom = map.getZoom()
    if (zoom < 5) {
        let center = map.getCenter()
        center.lng += 10
        // 使用easeTo实现过渡效果，第一个参数，过渡的属性，第二个参数，持续时间
        // 第三个参数，过渡函数，这里是线性过渡
        map.easeTo({ center, duration: 1000, easing: n => n })
    }
}
// 控制地球自转
const controlRotate = () => {
    // 将自转状态取反
    isRotate.value = !isRotate.value
    // 取反后，跟正常的思路相反,正常的思路：如果isRotate为true，停止
    // 但是因为我们先取反了，所以判断isRotate为false，再停止
    if (!isRotate.value) {
        map.stop()
    } else {
        rotateEarth()
    }
}
onMounted(() => {
    rotateEarth()
    // 当地球动作结束的时候，继续执行旋转地球的函数
    map.on('moveend', () => {
        // 如果发现是处于自转状态，就让地球自转
        isRotate.value && rotateEarth()
    })
})


// 定义emit事件，然后通知父组件，应该隐藏面板了
const emit = defineEmits(['changeChart'])

// 控制中心
const toggleControl = () => {
    emit('changeChart', !props.chartDisplay)
}

// 地图复位
const isInWuhan = ref(false)
const markPosition = computed(() => {
    return isInWuhan.value ? '地图复位' : '飞行武汉'
})
const flyTo = () => {
    if (isInWuhan.value) {
        map.flyTo({
            center: [114.30, 30.50],
            zoom: 1,
            pitch: 30,
            bearing: 40
        })
    } else {
        map.flyTo({
            center: [114.30, 30.50],
            zoom: 13,
            pitch: 30,
            bearing: 40
        })
    }
    isInWuhan.value = !isInWuhan.value
}

</script>

<style scoped>
.btn-groups {
    max-width: 500px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    transform: rotate(180deg);
    color: #fff;
}

.item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 10px;
}

.item>p {
    font-size: 12px;
}

.btn-toggle {
    border-radius: 50%;
    margin-bottom: 4px;
    border: 1px solid #000;
    background-color: #53697670;
    background: linear-gradient(to bottom, rgba(0, 128, 255, 0.377), rgba(0, 128, 255, 0.281));
    padding: 10px;
    color: #fff;
    border: none;
    outline: none;
    box-shadow: 0 0 5px 3px #333;
    cursor: pointer;
}

.btn-toggle:hover {
    background-color: #536976c4;
    background: linear-gradient(to bottom, rgba(0, 128, 255, 0.577), rgba(0, 128, 255, 0.581));
}
</style>