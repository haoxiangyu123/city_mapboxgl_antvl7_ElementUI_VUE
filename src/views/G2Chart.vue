<template>
    <div class="g2-left">
        <Panel style="margin-bottom: 16px;flex: 1;">
            <template v-slot:header>
                武汉各区今日出行人口统计
            </template>
            <template v-slot:content>
                <ColumnChart v-bind="peopleOutdoorConfig" :data="peopleOutdoorData" />
            </template>
        </Panel>
        <Panel style="flex: 1;">
            <template v-slot:header>
                武汉各区实时公交在线表
            </template>
            <template v-slot:content>
                <RoseChart v-bind="busOnlineConfig" :data="busOnlineData" />
            </template>
        </Panel>
    </div>
    <div class="g2-right">
        <Panel style="margin-bottom: 16px;">
            <template v-slot:header>
                武汉三镇人口统计
            </template>
            <template v-slot:content>
                <PieChart v-bind="config" :data="data" />
            </template>
        </Panel>
        <!-- 武汉三甲医院 -->
        <Panel style="margin-bottom: 16px;flex: 1;">
            <template v-slot:header>
                武汉三甲医院
            </template>
            <template v-slot:content>
                <div class="hospital">
                    <div class="item" v-for="item in hospital">
                        <p>
                            {{ item.title }}
                            <span>{{ item.num }}{{ item.unit }}</span>
                        </p>
                        <img :src="item.url" alt="" style="margin-top: 5px;width: 50px;height: 50px;">
                    </div>
                </div>
            </template>
        </Panel>
        <!-- 高校统计 -->
        <Panel style="flex: 1;">
            <template v-slot:header>
                武汉市高校学生统计
            </template>
            <template v-slot:content>
                <div class="hospital">
                    <div class="item" v-for="item in school">
                        <p>
                            {{ item.title }}
                            <span>{{ item.num }}{{ item.unit }}</span>
                        </p>
                        <img :src="item.url" alt="" style="margin-top: 5px;width: 50px;height: 50px;">
                    </div>
                </div>
            </template>
        </Panel>
    </div>
</template>

<script setup>
import Panel from '../components/Panel.vue';
import { ref } from 'vue'
// 从g2plot中引入图表组件
import { ColumnChart, RoseChart, PieChart } from '@opd/g2plot-vue'
// 引入hooks
import { useBusOnline } from '../Hooks/busOnline'
import { usePeopleOutDoor } from '../Hooks/peopleOutdoor'
import { usePeopleStatistic } from '../Hooks/peopleStatistic'
const { config: peopleOutdoorConfig, data: peopleOutdoorData } = usePeopleOutDoor()
const { config: busOnlineConfig, data: busOnlineData } = useBusOnline()
const { config, data } = usePeopleStatistic()
// 医院相关数据
const hospital = [{
    title: '医院',
    num: 30,
    unit: '家',
    url: '/src/assets/icon/医院.png'
}, {
    title: '门诊部',
    num: 300,
    unit: '个',
    url: '/src/assets/icon/门诊.png'
}, {
    title: '病床',
    num: 3000,
    unit: '张',
    url: '/src/assets/icon/病床.png'
}]

const school = [{
    title: '高校',
    num: 130,
    unit: '家',
    url: '/src/assets/icon/学校.png'
}, {
    title: '在校大学生',
    num: 100,
    unit: '万',
    url: '/src/assets/icon/学生.png'
}]

</script>
<style scoped>
.g2-left,
.g2-right {
    position: absolute;
    z-index: 3;
    width: 27vw;
    top: 120px;
    height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.g2-left {
    left: 20px;
}

.g2-right {
    right: 20px;
}

.hospital {
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.hospital .item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
</style>