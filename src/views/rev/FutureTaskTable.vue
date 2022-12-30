<template>
  <div class="table_wrapper">
    <div v-if="list&&list.length===0" class="no_content">
      未来没有需要复习的内容
    </div>
    <table v-if="list&&list.length>0">
      <thead>
      <tr>
        <th style="width: 10em;">未来日期</th>
        <th style="width: 6em;">距今天数</th>
        <th style="width: 6em;">复习数目</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="i in list">
        <td>{{ formatDate(i.date) }}</td>
        <td>{{ i.span }}</td>
        <td>{{ i.items.length }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import time_util from "@/utils/time_util";

export default {
  name: 'TaskTable',
  components: {},
  props: ["list"],
  data() {
    return {}
  },
  methods: {
    formatDate(date) {
      return time_util.date2str(date, true)
    }
  },


}
</script>

<style scoped>

.table_wrapper {
  /*border: 1px blue solid;*/
  display: flex;
  justify-content: center;
}

.no_content {
  font-size: large;
  color: gray;
}

table {
  /*margin: auto 0;*/
  /*border: 1px red solid;*/
}

table {
  border-collapse: collapse;
}

thead {
  color: rgb(138, 148, 153);
}

/*thead th {*/
/*  background-color: #f4f4f5;*/
/*  color: rgb(138, 148, 153);*/
/*}*/

th, td {
  text-align: center;
  /*vertical-align: middle;*/
}

tbody {
}

tbody tr:nth-child(even) {
  background-color: #f4f4f5;
}

td {
  padding: 5px;
}

th:first-child, td:first-child { /*每行的开头设置圆角*/
  /* top-left | top-right | bottom-right | bottom-left */
  border-radius: 20px 0 0 20px;
}

th:last-child, td:last-child { /*每行的结束设置圆角*/
  border-radius: 0 20px 20px 0;
}

</style>
