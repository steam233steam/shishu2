<template>
  <div>
    <h1>班级管理</h1>
    <br />

    <!-- 搜索表单 -->
    <div class="container">
      <el-form :inline="true" :model="searchClazz">
        <el-form-item label="班级名称">
          <el-input v-model="searchClazz.name" placeholder="请输入班级名称" />
        </el-form-item>

        <el-form-item label="结课时间">
          <el-date-picker
            v-model="searchClazz.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="clear">清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮 -->
    <div class="container">
      <el-button type="primary" @click="addClazz"> + 新增班级</el-button>
    </div>

    <!-- 表格（无多选列） -->
    <div class="container">
      <el-table
        :data="clazzList"
        border
        style="width: 100%"
        max-height="500"
      >
        <el-table-column prop="id" label="编号" width="80" align="center" />
        <el-table-column prop="name" label="班级名称" align="center" />
        <el-table-column prop="beginDate" label="开课日期" align="center" />
        <el-table-column prop="endDate" label="结课日期" align="center" />
        <el-table-column prop="status" label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '正常' : '已结课' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="最后修改时间" align="center" />
        <el-table-column label="操作" fixed="right" align="center" width="180">
          <template #default="scope">
            <el-button size="small" type="primary" @click="edit(scope.row.id)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="deleteById(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页（左对齐，样式与员工管理一致） -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 30, 50, 75, 100]"
        :pager-count="7"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/修改对话框（内容不变） -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form
        ref="clazzFormRef"
        :model="clazz"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="clazz.name" placeholder="请输入班级名称" />
        </el-form-item>
        <el-form-item label="班级教室" prop="room">
          <el-input v-model="clazz.room" placeholder="请输入班级教室" />
        </el-form-item>
        <el-form-item label="开课时间" prop="beginDate">
          <el-date-picker
            v-model="clazz.beginDate"
            type="date"
            placeholder="请选择开课日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="结课时间" prop="endDate">
          <el-date-picker
            v-model="clazz.endDate"
            type="date"
            placeholder="请选择结课日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="班主任" prop="masterId">
          <el-select
            v-model="clazz.masterId"
            placeholder="请选择班主任"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="emp in teacherList"
              :key="emp.id"
              :label="emp.name"
              :value="emp.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学科" prop="subject">
          <el-input v-model="clazz.subject" placeholder="请输入学科" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  queryPageApi,
  addApi,
  updateApi,
  deleteApi,
  queryInfoApi
} from '@/api/clazz'
import { queryAllApi as queryAllEmpApi } from '@/api/emp'

// ---------- 搜索数据 ----------
const searchClazz = ref({
  name: '',
  date: [],
  begin: '',
  end: ''
})

watch(
  () => searchClazz.value.date,
  (newVal) => {
    if (newVal && newVal.length === 2) {
      searchClazz.value.begin = newVal[0]
      searchClazz.value.end = newVal[1]
    } else {
      searchClazz.value.begin = ''
      searchClazz.value.end = ''
    }
  }
)

// ---------- 表格数据与分页 ----------
const clazzList = ref([])
const page = ref(1)        // 当前页码
const pageSize = ref(10)   // 每页条数
const total = ref(0)

// ---------- 班主任下拉数据 ----------
const teacherList = ref([])
const loadTeacherList = async () => {
  try {
    const res = await queryAllEmpApi()
    if (res.code) teacherList.value = res.data
  } catch (error) {
    console.error('加载班主任列表失败', error)
  }
}

// ---------- 查询 ----------

const search = async () => {
  const res = await queryPageApi({
    name: searchClazz.value.name,
    begin: searchClazz.value.begin,
    end: searchClazz.value.end,
    page: page.value,
    pagesize: pageSize.value
  })
  if (res.code) {
    clazzList.value = res.data.rows
    total.value = res.data.total
  }
}
// 清空搜索条件
const clear = () => {
  searchClazz.value = {
    name: '',
    date: [],
    begin: '',
    end: ''
  }
  page.value = 1
  search()
}

// ---------- 分页事件 ----------
const handleSizeChange = (val) => {
  pageSize.value = val
  page.value = 1
  search()
}
const handleCurrentChange = (val) => {
  page.value = val
  search()
}

// ---------- 新增/修改 ----------
const dialogVisible = ref(false)
const dialogTitle = ref('新增班级')
const clazzFormRef = ref(null)

const clazz = ref({
  id: undefined,
  name: '',
  room: '',
  beginDate: '',
  endDate: '',
  masterId: undefined,
  subject: ''
})

const rules = ref({
  name: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
  masterId: [{ required: true, message: '请选择班主任', trigger: 'change' }]
})

const addClazz = () => {
  dialogVisible.value = true
  dialogTitle.value = '新增班级'
  clazz.value = {
    id: undefined,
    name: '',
    room: '',
    beginDate: '',
    endDate: '',
    masterId: undefined,
    subject: ''
  }
  clazzFormRef.value?.resetFields()
}

const edit = async (id) => {
  const res = await queryInfoApi(id)
  if (res.code) {
    dialogVisible.value = true
    dialogTitle.value = '修改班级'
    clazz.value = res.data
  }
}

const save = async () => {
  if (!clazzFormRef.value) return
  clazzFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('表单校验不通过')
      return
    }
    let res
    if (clazz.value.id) {
      res = await updateApi(clazz.value)
    } else {
      res = await addApi(clazz.value)
    }
    if (res.code) {
      ElMessage.success('保存成功')
      dialogVisible.value = false
      search()
    } else {
      ElMessage.error(res.msg || '保存失败')
    }
  })
}

// ---------- 删除 ----------
const deleteById = (id) => {
  ElMessageBox.confirm('确定删除该班级吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const res = await deleteApi(id)
      if (res.code) {
        ElMessage.success('删除成功')
        search()
      } else {
        ElMessage.error(res.msg || '删除失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// ---------- 生命周期 ----------
onMounted(() => {
  search()
  loadTeacherList()
})
</script>

<style scoped>
.container {
  margin: 10px 0;
}

.pagination-wrapper {
  margin-top: 15px;
  /* 左对齐，默认就是左对齐，无需额外样式 */
}
</style>