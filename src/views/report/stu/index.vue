<script setup>
import { ref, onMounted } from 'vue'
import { querystudentcountdata,querystudentdegreedata } from '@/api/report'
// ----- 学历统计 -----
const eduBarOption = ref({
  title: { text: '学历人数统计' },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: [] },
  yAxis: { type: 'value' },
  series: [{ name: '人数', type: 'bar', data: [], barWidth: '40%' }]
})

const eduPieOption = ref({
  title: { text: '学历占比', left: 'center' },
  tooltip: { trigger: 'item' },
  legend: { orient: 'vertical', left: 'left' },
  series: [{ type: 'pie', radius: ['40%', '70%'], data: [] }]
})

const fetchEduStats = async () => {
  try {
    const res = await querystudentdegreedata()  // 替换为实际接口
    const data = res.data || [] // 假设格式: [{ education: '本科', value: 120 }, ...]
    const labels = data.map(item => item.name)
    const values = data.map(item => item.value)
    eduBarOption.value.xAxis.data = labels
    eduBarOption.value.series[0].data = values
    const pieData = data.map(item => ({ name: item.name, value: item.value }))
    eduPieOption.value.series[0].data = pieData
  } catch (error) {
    console.error('获取学历统计失败', error)
  }
}

// ----- 班级人数统计 -----
const classBarOption = ref({
  title: { text: '班级人数统计' },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: [] },
  yAxis: { type: 'value' },
  series: [{ name: '人数', type: 'bar', data: [], barWidth: '40%' }]
})

const classPieOption = ref({
  title: { text: '班级人数占比', left: 'center' },
  tooltip: { trigger: 'item' },
  legend: { orient: 'vertical', left: 'left' },
  series: [{ type: 'pie', radius: ['40%', '70%'], data: [] }]
})

const fetchClassStats = async () => {
  try {
    const res = await querystudentcountdata()  // 替换为实际接口
    const data = res.data || [] // 假设格式: [{ className: 'Java一班', studentCount: 35 }, ...]
    const labels = data.clazzList || []
    const values = data.dataList || []
    classBarOption.value.xAxis.data = labels
    classBarOption.value.series[0].data = values
    classPieOption.value.series[0].data = labels.map((label, idx) => ({
      name: label,
      value: values[idx] || 0
    }))
  } catch (error) {
    console.error('获取班级统计失败', error)
  }
}

onMounted(() => {
  fetchEduStats()     // 新增
  fetchClassStats()   // 新增
})
</script>

<template>
    <!-- ====== 学员学历统计 ====== -->
    <div style="margin-top: 30px;">
      <h3 class="section-title">学历分布</h3>
      <div class="charts-row">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">各学历人数</span>
            <el-tag size="small" type="primary">条形图</el-tag>
          </div>
          <div class="chart-wrapper">
            <v-chart class="chart" :option="eduBarOption" />
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">学历占比</span>
            <el-tag size="small" type="success">饼图</el-tag>
          </div>
          <div class="chart-wrapper">
            <v-chart class="chart" :option="eduPieOption" />
          </div>
        </div>
      </div>
    </div>

    <!-- ====== 班级人数统计 ====== -->
    <div style="margin-top: 30px;">
      <h3 class="section-title">班级人数分布</h3>
      <div class="charts-row">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">各班级人数</span>
            <el-tag size="small" type="info">条形图</el-tag>
          </div>
          <div class="chart-wrapper">
            <v-chart class="chart" :option="classBarOption" />
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">班级人数占比</span>
            <el-tag size="small" type="warning">饼图</el-tag>
          </div>
          <div class="chart-wrapper">
            <v-chart class="chart" :option="classPieOption" />
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