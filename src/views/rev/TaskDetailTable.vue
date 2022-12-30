<template>
  <div class="table_wrapper">
    <table>
      <thead>
      <tr>
        <th>笔记</th>
        <th style="width: 7em;">复习次数</th>
        <th style="width: 7em;">距上次复习</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="i in 8">
        <td>/home/note/笔记1</td>
        <td>2</td>
        <td>2天</td>
        <td>
          <el-link>推迟</el-link>
          <span style="margin-right: 10px"></span>
          <el-link>存档</el-link>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  name: 'TaskTable',
  components: {},
  methods: {},
  props: ["list"],
  data() {
    return {}
  }

}
</script>

<style scoped>

.table_wrapper {
  /*border: 1px blue solid;*/
  display: flex;
  justify-content: center;
}

table {
  /*margin: auto 0;*/
  /*border: 1px red solid;*/
}

table {
  border-collapse: collapse;
}

th, td {
  text-align: center;
  vertical-align: middle;
}

tbody tr:nth-child(even) {
  background-color: #f4f4f5;
}


td {
  padding: 5px;
}

</style>
