<template>
    <!-- popper-style修改popover的样式 -->
    <el-popover placement="top" width="100" trigger="hover" popper-style="background-color: #53697670;color: #fff;">
        <!-- popover的内容 -->
        <div class="popover-content">
            <i v-for="item in toolsIcon" :class="['iconfont', `icon-${item}`]" @click="query(item)"></i>
        </div>
        <!-- popover的触发器 -->
        <template #reference>
            <slot></slot>
        </template>
    </el-popover>
    <!-- 展示组件的引用 -->
    <DisplayCard :dataSource="eventData" v-if="showCard"/>
</template>
<!-- CR  M -->
<!-- 减少重复 -->
<script setup>
import { ref, inject, onMounted,computed } from 'vue'
// 引入axios
import axios from 'axios'
import DisplayCard from './DisplayCard.vue'
// 引入antv/L7 draw
import { DrawPolygon, DrawRect, DrawCircle, DrawEvent } from '@antv/l7-draw'
import { point, polygon, booleanPointInPolygon } from '@turf/turf'
const toolsIcon = ['drawPolygonTool', 'drawRectTool', 'drawCircleTool', 'delete']
const { scene, map } = inject('$scene_map')
// 我们drawTools组件挂载的时候，获取到的服务端数据
let dataSource = []
const eventData=ref([])

const showCard=computed(()=>{
    return eventData.value.length
})

// 初始化绘制工具
// drawTools：用来存放绘制工具对象的缓存
const drawTools = {}

// 实例化 Draw
// const draw = new DrawPoint(scene, {
//     editable: false,
//     // Draw 配置
//   });
// 初始化绘制工具
const initDrawTool = () => {
    // 根据工具列表，初始化对应的绘制工具，并将绘制工具对象放入一个缓存中
    toolsIcon.forEach(tool => {
        switch (tool) {
            case 'drawPolygonTool':
                drawTools[tool] = new DrawPolygon(scene, {
                    editable: true
                })
                break;
            case 'drawRectTool':
                drawTools[tool] = new DrawRect(scene, {
                    editable: true
                })
                break;
            case 'drawCircleTool':
                drawTools[tool] = new DrawCircle(scene, {
                    editable: true
                })
                break;
            case 'delete':
                // 执行删除逻辑
                break;
            default:
                break;
        }
    })
}

// 通过服务，获取所有的事件点数据
const getData = async () => {
    // {status:200,data:geoJSON}
    // 注意：将data解构出来，再赋值
    const { data } = await axios.get('http://localhost:8777/wuhan_events')
    dataSource = data
}

// 组件挂载的时候，我们初始化绘制工具
onMounted(() => {
    initDrawTool()
    getData()
})

// 清除之前绘制的
const stopDrawing = () => {
    for (let key in drawTools) {
        const tool = drawTools[key]
        // clear清除绘制结果
        tool.clear()
        tool.disable()
        tool.removeActiveFeature()
    }
}

const query = (type) => {
    // 每次将上一次的绘制结果清除
    stopDrawing()
    // 如果为删除，直接退出
    if (type === 'delete') {
        return
    }
    // 找到对应的绘制工具
    const drawTool = drawTools[type]
    if (drawTool) {
        drawTool.enable()
        // 监听每次数据发生变化时候的事件
        drawTool.on(DrawEvent.Change, (allFeatures) => {
            // 每次数据变化的时候，我们将之前的删除，只保留当前绘制的图形
            allFeatures.forEach((feature, index) => {
                if (index !== allFeatures.length - 1) {
                    drawTool.removeFeature(feature)
                }
                // 只有是绘制的最后一项时才需要对数据进行筛选
                if (index === allFeatures.length - 1) {
                    const { geometry: { coordinates } } = feature
                    const polygonArea = polygon(coordinates)
                    console.log(dataSource);
                    // {features,properties}
                    // 返回在范围内的点
                    const resData = dataSource.features.filter(item => {
                        // 从geoJSON数据中获取到点的坐标
                        const {geometry:{coordinates}}=item
                        // 通过点的坐标，构造turf类型的点数据
                        const pointTurf=point(coordinates)
                        // 调用turf的api，判断点是否在多边形内
                        const isInArea=booleanPointInPolygon(pointTurf,polygonArea)
                        return isInArea
                    })
                    // eventData赋值，eventData是ref数据，所以需要赋值.value
                    eventData.value=resData
                }
            })
        })
    }
}


</script>
<style scoped>
.popover-content {
    display: flex;
    justify-content: space-around;
}

.popover-content>i {
    cursor: pointer;
    padding: 4px;
}

.popover-content>i:hover {
    background-color: #536976e0;
}
</style>