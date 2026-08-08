<script setup>
import { ref, onMounted } from 'vue'
import { queryempjobdataApi,queryempgenderdataApi } from '@/api/report'
// 定义响应式数据
const barOption = ref({
  title: { text: '职位人数统计' },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: [] },
  yAxis: { type: 'value' },
  series: [{ name: '人数', type: 'bar', data: [], barWidth: '40%' }]
})

const pieOption = ref({
  title: { text: '职位占比', left: 'center' },
  tooltip: { trigger: 'item' },
  legend: { orient: 'vertical', left: 'left' },
  series: [{ type: 'pie', radius: ['40%', '70%'], data: [] }]
})

// 请求数据并更新图表
const fetchPositionStats = async () => {
  try {
    const res = await queryempjobdataApi() // 替换为你的实际接口
    // 假设返回数据为 { labels: [...], values: [...] }
    const labels = res.data.joblist || []
    const values = res.data.datalist || []

    // 更新条形图
    barOption.value.xAxis.data = labels
    barOption.value.series[0].data = values

    // 更新饼图（需要转换为 { name, value } 格式）
    const pieData = labels.map((label, index) => ({
      name: label,
      value: values[index] || 0
    }))
    pieOption.value.series[0].data = pieData

  } catch (error) {
    console.error('获取职位统计失败', error)
  }
}

// 性别条形图配置
const genderBarOption = ref({
  title: { text: '男女数量对比' },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: [] },
  yAxis: { type: 'value' },
  series: [{ name: '人数', type: 'bar', data: [], barWidth: '40%' }]
})

// 性别饼图配置（原 genderOption 重命名）
const genderPieOption = ref({
  title: { text: '性别比例', left: 'center' },
  tooltip: { trigger: 'item' },
  legend: { orient: 'vertical', left: 'left' },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    data: [],
    itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
    label: { show: true, formatter: '{b}\n{d}%' }
  }]
})

// 修改 fetchGenderStats
const fetchGenderStats = async () => {
  try {
    const res = await queryempgenderdataApi()
    const data = res.data || [] // 假设格式: [{ gender: '男', value: 60 }, { gender: '女', value: 40 }]
    
    const labels = data.map(item => item.name)
    const values = data.map(item => item.value)
    
    // 更新条形图
    genderBarOption.value.xAxis.data = labels
    genderBarOption.value.series[0].data = values
    
    // 更新饼图
    const pieData = data.map(item => ({ name: item.name, value: item.value }))
    genderPieOption.value.series[0].data = pieData
  } catch (error) {
    console.error('获取性别统计失败', error)
  }
}

// ----- 初始化数据 -----
onMounted(() => {
  fetchPositionStats()
  fetchGenderStats()
})

</script>
<template>
  <div class="stats-container">
    <!-- 页面标题 -->
    <h2 class="page-title">数据统计看板</h2>
    
    <!-- ====== 职位统计（原有） ====== -->
    <div style="margin-bottom: 10px;">
      <h3 class="section-title">职位分布</h3>
      <div class="charts-row">
        <!-- 条形图 -->
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">各职位人数</span>
            <el-tag size="small" type="info">条形图</el-tag>
          </div>
          <div class="chart-wrapper">
            <v-chart class="chart" :option="barOption" />
          </div>
        </div>
        <!-- 饼图 -->
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">职位占比</span>
            <el-tag size="small" type="success">饼图</el-tag>
          </div>
          <div class="chart-wrapper">
            <v-chart class="chart" :option="pieOption" />
          </div>
        </div>
      </div>
    </div>

   <!-- ====== 性别统计（新增） ====== -->
<div style="margin-top: 30px;">
  <h3 class="section-title">性别分布</h3>
  <div class="charts-row">
    <!-- 条形图 -->
    <div class="chart-card">
      <div class="chart-header">
        <span class="chart-title">男女数量</span>
        <el-tag size="small" type="warning">条形图</el-tag>
      </div>
      <div class="chart-wrapper">
        <v-chart class="chart" :option="genderBarOption" />
      </div>
    </div>
    <!-- 饼图 -->
    <div class="chart-card">
      <div class="chart-header">
        <span class="chart-title">性别比例</span>
        <el-tag size="small" type="danger">饼图</el-tag>
      </div>
      <div class="chart-wrapper">
        <v-chart class="chart" :option="genderPieOption" />
      </div>
    </div>
  </div>
</div>
  </div>
</template>
<style scoped>
.stats-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-title {
  text-align: center;
  margin-bottom: 20px;
  color: #303133;
  font-weight: 500;
}

.section-title {
  margin-left: 8px;
  color: #606266;
  font-weight: 500;
  border-left: 4px solid #409EFF;
  padding-left: 10px;
}

/* 横向并排容器 */
.charts-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

/* 图表卡片 */
.chart-card {
  flex: 1;
  min-width: 300px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  padding: 16px;
  transition: box-shadow 0.3s;
}
.chart-card:hover {
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.chart-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.chart-wrapper {
  width: 100%;
  height: 300px; /* 适当降低高度，美观 */
}
.chart {
  width: 100%;
  height: 100%;
}
</style>