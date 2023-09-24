<template>
    <div></div>
</template>

<script setup>
import { inject, onMounted } from 'vue'
import { Logo, Zoom, Fullscreen, MouseLocation, MapTheme } from '@antv/l7'
// 依赖注入，拿到L7和mapbox地图实例
const { scene, map } = inject('$scene_map')

onMounted(() => {
    // 标志
    const logo = new Logo({
        position: 'lefttop',
        // 图片 url
    });
    scene.addControl(logo)

    // 放大缩小
    const zoom = new Zoom({
        position: 'leftbottom',
        zoomInTitle: '放大',
        zoomOutTitle: '缩小',
        className: 'my-test-class',
    });
    scene.addControl(zoom)

    // 全屏控件
    const fullScreen = new Fullscreen({
        btnText: '全屏',
        exitBtnText: '推出全屏'
    })
    scene.addControl(fullScreen)

    // 鼠标位置控件
    const mouseLoc = new MouseLocation({
        transform: (position) => {
            return position.map(item => item.toFixed(4));
        },
        position:'rightbottom'
    })
    scene.addControl(mouseLoc)

    // 地图主题控件
    const mapTheme=new MapTheme({})
    scene.addControl(mapTheme)
})

</script>
<style scoped></style>