<template>
  <div class="toolbar">
    <span class="label">时间：</span>
    <el-date-picker
      :model-value="query.endDate"
      @update:model-value="val => $emit('update:query', { ...query, endDate: val })"
      type="date"
      placeholder="选择日期"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      size="default"
      style="width:160px"
    />
    <el-input-number
      :model-value="query.endHour"
      @update:model-value="val => $emit('update:query', { ...query, endHour: val })"
      :min="0" :max="23"
      size="default"
      style="width:80px"
    />
    <span style="font-size:12px;color:#999;">时</span>

    <span class="label" style="margin-left:8px;">类型：</span>
    <el-select
      :model-value="query.typeId"
      @update:model-value="val => $emit('update:query', { ...query, typeId: val })"
      placeholder="请选择"
      size="default"
      style="width:130px"
    >
      <el-option label="全部" value="all" />
      <el-option label="代表站" value="repr" />
      <el-option label="防汛站" value="flood" />
      <el-option label="海事" value="maritime" />
      <el-option label="外省市" value="outer" />
    </el-select>

    <el-button type="primary" :loading="loading" @click="$emit('search')">
      <el-icon><Search /></el-icon>
      查询
    </el-button>
    <el-button @click="$emit('reset')">重置</el-button>

    <span class="spacer"></span>

    <el-button @click="$emit('export')">
      <el-icon><Download /></el-icon>
      导出
    </el-button>
  </div>
</template>

<script setup>
defineProps({
  query: { type: Object, required: true },
  loading: { type: Boolean, default: false },
})

defineEmits(['update:query', 'search', 'reset', 'export'])
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}
.label {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
}
.spacer {
  flex: 1;
}
</style>
