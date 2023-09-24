<template>
    <div class="displayCard">
        <!-- 设置表格大小，最高高度 -->
        <el-table :data="tableData" style="width: 270px" size="small" :max-height="400" @row-click="clickRow">
            <!-- 设置表格每一列的宽度 -->
            <el-table-column prop="event_num" label="编号" width="90">
            </el-table-column>
            <el-table-column prop="name" label="类型" width="90">
            </el-table-column>
            <el-table-column label="操作" width="90">
                <!-- vue3中使用作用域插槽 #default -->
                <template #default="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <!-- 注意将对话框放到body上 -->
    <el-dialog v-model="dialogVisible" title="事故详情" width="50%" append-to-body="true">
        <el-table :data="detailData" style="width: 100%" size="small" :max-height="400">
            <!-- 设置表格每一列的宽度 -->
            <el-table-column prop="event_num" label="编号">
            </el-table-column>
            <el-table-column prop="longtitude" label="经度">
            </el-table-column>
            <el-table-column prop="latitude" label="纬度">
            </el-table-column>
            <el-table-column prop="name" label="类型">
            </el-table-column>
            <el-table-column prop="area" label="事故区域">
            </el-table-column>
            <el-table-column prop="car_num" label="车牌号">
            </el-table-column>
            <el-table-column prop="level" label="事件等级">
            </el-table-column>
            <el-table-column prop="phone" label="手机号">
            </el-table-column>
        </el-table>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { onMounted, ref, watch, inject,onUnmounted } from 'vue'
import { PointLayer } from '@antv/l7'
const { scene, map } = inject('$scene_map')
// 接收从父组件传来的数据
const props = defineProps({
    dataSource: Array
})
// 控制对话框显示隐藏
const dialogVisible = ref(false)

// 右下角表格数据
const tableData = ref([])

// 详情框的数据源
const detailData = ref([])

onMounted(() => {
    //1. 组件挂载的时候，添加图片layer
    scene.addImage('crash', '/src/assets/crash.jpg')
    console.log(props.dataSource);
    // 在mounted中，也要去重新渲染卡片
    reRenderCard()
})

// 组件销毁的时候，将地图元素都清空
onUnmounted(()=>{
    pointLayer && scene.removeLayer(pointLayer)
    markerLayer && scene.removeLayer(markerLayer)
})

watch(() => props.dataSource, () => {
    // 重新渲染卡片
    reRenderCard()
})

let pointLayer
// 重渲染函数
const reRenderCard = () => {
    // 1.改变tableData 用于渲染表格
    // 2.渲染地图元素
    const data = []
    // {
    // lng:114.30,
    // lat:30.50,
    // type
    //}
    console.log(props.dataSource);
    // 每次重新渲染的时候，将之前的图标和雷达标注都删除
    if (pointLayer) {
        scene.removeLayer(pointLayer)
        pointLayer = null
    }
    if(markerLayer){
        scene.removeLayer(markerLayer)
        markerLayer = null
    }
    // 数据处理
    tableData.value = props.dataSource.map(item => {
        // rest就是在properties中其余的属性，除了event_num和name之外的
        const { geometry, properties: { event_num, name, ...rest } } = item
        data.push({
            lng: geometry.coordinates[0],
            lat: geometry.coordinates[1],
            name
        })
        return {
            geometry,
            event_num: event_num,
            name: name,
            rest
        }
    })
    console.log(tableData.value);
    console.log(data);
    // 渲染地图元素
    // 创建点图层，然后赋值，json类型的数据，我们需要使用parser解析，shape填入，我们在挂载钩子里，定义的图片标注
    pointLayer = new PointLayer().source(data, {
        parser: {
            type: 'json',
            x: 'lng',
            y: 'lat'
        }
    }).shape('crash').size(16)
    scene.addLayer(pointLayer)
}

// 点击详情,展示对话框
const handleClick = (data) => {
    console.log(data);
    dialogVisible.value = true
    // 数据处理,得到detailData
    const { geometry: { coordinates }, event_num, name, rest: { area, car_num, level, phone } } = data
    detailData.value = [{
        event_num,
        longtitude: coordinates[0],
        latitude: coordinates[1],
        name,
        area,
        car_num, level,
        phone
    }]
    console.log(detailData.value);
}

let markerLayer
// 点击表格行
const clickRow = (row) => {
    // 每次点击行，删除之前的雷达
    if(markerLayer){
        console.log(markerLayer);
        scene.removeLayer(markerLayer)
        markerLayer=null
    }
    console.log(row);
    // 1.跳转到事故点
    map.flyTo({
        // 飞行中心点
        center: row.geometry.coordinates,
        zoom: 15,
        speed: 0.4
    })
    const data = [{
        lng: row.geometry.coordinates[0],
        lat: row.geometry.coordinates[1]
    }]

    // 在事故点渲染雷达扫描点
    markerLayer = new PointLayer().source(data, {
        parser: {
            type: 'json',
            x: 'lng',
            y: 'lat'
        }
    }).shape('radar').size(60).color('#f00').animate(true)
    scene.addLayer(markerLayer)
}
</script>


<style scoped>
.displayCard {
    width: 270px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: -305px;
    bottom: 75px;
    outline: none;
    color: #fff;
    background: #53697670;
    border-radius: 4px;
    box-shadow: 0 0 5px 3px #333;
}

.eleCeil {
    background: transparent;
    text-overflow: ellipsis;
    white-space: nowrap;
}

:deep(.el-table) {
    background-color: transparent;
}

:deep(.el-table tr) {
    background-color: transparent;
    color: #fff;
    cursor: pointer;
}

:deep(.el-table tr:hover) {
    background-color: #333;
}

:deep(.el-table--enable-row-transition .el-table__body td.el-table__cell) {
    background-color: transparent;
}

:deep(.el-table th.el-table__cell) {
    background-color: transparent;
}

:deep(.el-table td.el-table__cell) {
    border-bottom: none;
}

:deep(.el-table__inner-wrapper::before) {
    height: 0;
}

:deep(.cell) {
    white-space: nowrap;
}
</style>