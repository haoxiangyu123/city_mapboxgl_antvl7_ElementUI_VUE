<template>
    <div></div>
</template>

<script setup>
import { inject, onMounted } from 'vue'
// 引入cityBuildLayer，LineLayer
import { CityBuildingLayer,LineLayer,LayerSwitch } from '@antv/l7'
// 依赖注入，拿到L7和mapbox地图实例
const { scene, map } = inject('$scene_map')
// 引入axios去调用服务
import axios from 'axios'

// 添加城市
const addCityBuild = async () => {
    // 服务路径，和你终端里面resources中的保持一致
    const buildData = await axios('http://localhost:8777/wuhan_building')
    const cityLayer = new CityBuildingLayer({
        name: '武汉市建筑'
    })
    // 使用Elevation字段对建筑进行高度的调整
    cityLayer.source(buildData.data).size('Elevation', h => h).color('rgb(242,246,250)').animate({
        enable: true
    }).active({
        color: '#0ff',
        mix: 0.5
    }).style({
        opacity: 0.7,
        baseColor: 'rgb(16,16,16)',
        windowColor: 'rgb(30,60,89)',
        brightColor: 'rgb(255,176,38)',
        sweep: {
            enable: true,
            sweepRadius: 2,
            sweepColor: '#1990fF',
            sweepSpeed: 0.3,
            // 泛光中心点
            sweepCenter: [114.30, 30.50]
        }
        // 使用 Elevation 字段也就是楼房的高度，对建筑进行筛选
    }).filter('Elevation', h => h > 40)
    scene.addLayer(cityLayer)
    return cityLayer
}

// 添加道路流动线
const addFlowLines=async ()=>{
    // http://localhost:8080/wuhan_roads
    const roadsData=await axios('http://localhost:8777/wuhan_roads')
    const colors = [
                '#87CEFA',
                '#00BFFF',
                '#7FFFAA',
                '#00FF7F',
                '#32CD32',
                '#F0E68C',
                '#FFD700',
                '#FF7F50',
                '#FF6347',
                '#FF0000',
                '#FF2D51',
                "#333"
            ]
    // 添加道路流动线
    const lineLayerRoads=new LineLayer({
        name:'武汉市道路'
    }).source(roadsData.data).size(1).shape('line').color('name',colors).animate({
        interval:1, //流线间隔
        duration:2,  //流线持续时间
        trailLength:2 //流线长度
    }).filter('coordinates',(evt)=>{
        return evt.length>20
    })
    scene.addLayer(lineLayerRoads)
    return lineLayerRoads
}

onMounted(async () => {
    const buildLayer=await addCityBuild()
    const flowLayer=await addFlowLines()
    // 绑定图层至图层目录
    const LayerContent=new LayerSwitch({
        title:'图层目录',
        layers:[buildLayer,flowLayer]
    })
    scene.addControl(LayerContent)
})
//新开一个终端，运行pnpm mock
</script>
<style scoped></style>