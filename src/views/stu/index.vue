<template>
  <div>
    <h1>学员管理</h1>
    <br />

    <!-- 搜索表单 -->
    <div class="container">
      <el-form :inline="true" :model="searchStudent">
        <el-form-item label="姓名">
          <el-input v-model="searchStudent.name" placeholder="请输入学生姓名" />
        </el-form-item>

        <el-form-item label="最高学历">
          <el-select v-model="searchStudent.degree" placeholder="请选择" clearable>
            <el-option label="初中" :value="1" />
            <el-option label="高中" :value="2" />
            <el-option label="大专" :value="3" />
            <el-option label="本科" :value="4" />
            <el-option label="硕士" :value="5" />
            <el-option label="博士" :value="6" />
          </el-select>
        </el-form-item>

        <el-form-item label="所属班级">
          <el-select v-model="searchStudent.clazzId" placeholder="请选择班级" clearable>
            <el-option
              v-for="clazz in clazzList"
              :key="clazz.id"
              :label="clazz.name"
              :value="clazz.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="clear">清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮 -->
    <div class="container">
      <el-button type="primary" @click="addStudent"> + 新增学员</el-button>
      <el-button type="danger" @click="deleteByIds" :disabled="selectedIds.length === 0">
        批量删除
      </el-button>
    </div>

    <!-- 表格 -->
    <div class="container">
      <el-table
        :data="studentList"
        border
        height="550"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="name" label="姓名" align="center" />
        <el-table-column prop="no" label="学号" align="center" />
        <el-table-column prop="clazzName" label="班级" align="center" />
        <el-table-column prop="gender" label="性别" align="center">
          <template #default="scope">
            {{ scope.row.gender === 1 ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center" />
        <el-table-column prop="degree" label="最高学历" align="center" />
        <el-table-column prop="violationCount" label="违纪次数" align="center" />
        <el-table-column prop="violationScore" label="违纪扣分" align="center" />
        <el-table-column prop="updateTime" label="最后修改时间" align="center" />
        <el-table-column label="操作" fixed="right" align="center" width="200">
          <template #default="scope">
            <el-button size="small" type="primary" @click="edit(scope.row.id)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="deleteById(scope.row.id)">
              删除
            </el-button>
            <el-button size="small" type="warning" @click="handleViolation(scope.row.id)">
              违纪
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 30, 50]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="search"
      />
    </div>

    <!-- 新增/修改对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="750px">
      <el-form
        ref="studentFormRef"
        :model="student"
        :rules="rules"
        label-width="85px"
        class="dialog-form-grid"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="student.name" placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item label="学号" prop="no">
          <el-input v-model="student.no" placeholder="请输入学号" />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="student.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="student.phone" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="student.idCard" placeholder="请输入身份证号" />
        </el-form-item>

        <el-form-item label="是否院校" prop="isCollege">
          <el-select v-model="student.isCollege" placeholder="请选择" style="width: 100%">
            <el-option label="是" :value="1" />
            <el-option label="否" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="联系地址" prop="address">
          <el-input v-model="student.address" placeholder="请输入联系地址" />
        </el-form-item>

        <el-form-item label="最高学历" prop="degree">
          <el-select v-model="student.degree" placeholder="请选择学历" style="width: 100%">
            <el-option label="初中" :value="1" />
            <el-option label="高中" :value="2" />
            <el-option label="大专" :value="3" />
            <el-option label="本科" :value="4" />
            <el-option label="硕士" :value="5" />
            <el-option label="博士" :value="6" />
          </el-select>
        </el-form-item>

        <el-form-item label="毕业时间" prop="graduationDate">
          <el-date-picker
            v-model="student.graduationDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="所属班级" prop="clazzId" >
          <el-select v-model="student.clazzId" placeholder="请选择班级" style="width: 100%">
            <el-option
              v-for="clazz in clazzList"
              :key="clazz.id"
              :label="clazz.name"
              :value="clazz.id"
            />
          </el-select>
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
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  queryPageApi,
  addApi,
  updateApi,
  deleteApi,
  queryInfoApi,
  updatebyscoreApi
} from '@/api/student'
import { queryAllApi as queryAllClazzApi } from '@/api/clazz'

// ---------- 搜索数据 ----------
const searchStudent = ref({
  name: '',
  degree: '',
  clazzId: ''
})

// ---------- 表格数据与分页 ----------
const studentList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// ---------- 多选 ----------
const selectedIds = ref([])
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id)
}

// ---------- 班级下拉 ----------
const clazzList = ref([])
const loadClazzList = async () => {
  if (clazzList.value.length > 0) return
  try {
    const res = await queryAllClazzApi()
    if (res.code) {
      clazzList.value = res.data
    }
  } catch (error) {
    console.error('加载班级列表失败', error)
  }
}

// ---------- 查询 ----------
const search = async () => {
  const params = {
    page: currentPage.value,
    pagesize: pageSize.value
  }

  if (searchStudent.value.name) params.name = searchStudent.value.name.trim()
  if (searchStudent.value.degree) params.degree = Number(searchStudent.value.degree)
  
  // ✅ 核心修正：后端 POJO 已统一为 clazzId，这里要直接传 clazzId
  if (searchStudent.value.clazzId) {
    params.clazzId = Number(searchStudent.value.clazzId)
  }

  console.log('🔍 即将发送给后端的请求参数:', params)

  const res = await queryPageApi(params)
  
  console.log('📩 后端返回的响应数据:', res)

  if (res.code) {
    studentList.value = res.data.rows
    total.value = res.data.total
  }
}

// ---------- 清空 ----------
const clear = () => {
  searchStudent.value = {
    name: '',
    degree: '',
    clazzId: ''
  }
  currentPage.value = 1
  search()
}

// ---------- 分页大小改变 ----------
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  search()
}

// ---------- 新增/修改 ----------
const dialogVisible = ref(false)
const dialogTitle = ref('新增学员')
const studentFormRef = ref(null)

const student = ref({
  id: undefined,
  name: '',
  no: '',
  gender: 1,
  phone: '',
  idCard: '',
  isCollege: 1,
  address: '',
  degree: '',
  graduationDate: '',
  clazzId: ''
})

const rules = ref({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  no: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ],
  idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
  degree: [{ required: true, message: '请选择最高学历', trigger: 'change' }],
  clazzId: [{ required: true, message: '请选择所属班级', trigger: 'change' }]
})

const addStudent = () => {
  dialogVisible.value = true
  dialogTitle.value = '新增学员'
  student.value = {
    id: undefined,
    name: '',
    no: '',
    gender: 1,
    phone: '',
    idCard: '',
    isCollege: 1,
    address: '',
    degree: '',
    graduationDate: '',
    clazzId: ''
  }
  studentFormRef.value?.resetFields()
}

// 🌟 解决回显问题的 edit 方法（兼容旧后端并完美回显新字段）
const edit = async (id) => {
  // 1. 确保有下拉列表
  await loadClazzList()

  // 2. 获取详情
  const res = await queryInfoApi(id)
  if (res.code) {
    dialogVisible.value = true
    dialogTitle.value = '修改学员'
    const data = res.data

    // 3. 解决回显映射问题：兼容后端返回 classId 或 clazzId 两种情况
    let targetClazzId = data.clazzId || data.classId

    // 如果后端返回的是 clazzName，就从下拉列表反向寻找 id
    if (!targetClazzId && data.clazzName) {
      const foundClazz = clazzList.value.find((item) => item.name === data.clazzName)
      if (foundClazz) {
        targetClazzId = foundClazz.id
      }
    }

    // 4. 覆盖赋值，确保 el-select 可以正常回显
    student.value = {
      ...data,
      clazzId: Number(targetClazzId) || undefined
    }
  }
}

const save = async () => {
  if (!studentFormRef.value) return
  studentFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('表单校验不通过')
      return
    }
    let res
    if (student.value.id) {
      res = await updateApi(student.value)
    } else {
      res = await addApi(student.value)
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
  ElMessageBox.confirm('确定删除该学员吗？', '提示', {
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

const deleteByIds = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先选择要删除的学员')
    return
  }
  ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 名学员吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const idsStr = selectedIds.value.join(',')
      const res = await deleteApi(idsStr)
      if (res.code) {
        ElMessage.success('批量删除成功')
        search()
      } else {
        ElMessage.error(res.msg || '批量删除失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// ---------- 违纪处理 ----------
const handleViolation = (id) => {
  ElMessageBox.prompt('请输入违纪扣分', '违纪处理', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputType: 'number',
    inputPattern: /^\d+$/,
    inputErrorMessage: '请输入有效的正整数'
  })
    .then(async ({ value }) => {
      const score = parseInt(value)
      if (isNaN(score) || score < 0) {
        ElMessage.error('请输入有效的正整数')
        return
      }
      const res = await updatebyscoreApi(id, score)
      if (res.code) {
        ElMessage.success('违纪处理成功')
        currentPage.value = 1
        await search()
      } else {
        ElMessage.error(res.msg || '违纪处理失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消输入')
    })
}

// ---------- 生命周期 ----------
onMounted(() => {
  search()
  loadClazzList()
})
</script>

<style scoped>
.container {
  margin: 10px 0;
}
/* 表单两列布局 */
.dialog-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 20px;
}
/* 让特殊字段占据整行 */
.full-width-item {
  grid-column: 1 / -1;
}
</style>