<template>
  <div class="RevTopBar">
    <icon-btn icon="el-icon-arrow-left" @click="$router.go(-1)"></icon-btn>
    <div class="stepper_wrapper">
<!--      <i class="el-icon-arrow-left stepper_btn" @click="$emit('toLast')"></i>-->
      <span class="stepper">{{ stepIndex }}/{{ revItems.length }}</span>
<!--      <i class="el-icon-arrow-right stepper_btn" @click="$emit('toNext')"></i>-->
    </div>
    <!--  编辑、存档、信息、星标-->
    <!--      <icon-btn icon="el-icon-star-on"></icon-btn>-->
    <!--      <icon-btn icon="el-ic on-collection-tag"></icon-btn>-->
    <!--    <icon-btn icon="el-icon-edit"></icon-btn>-->
    <!--    <el-tooltip class="item" effect="dark" content="存档" placement="top-start" :open-delay="1000">-->
    <!--      <icon-btn icon="el-icon-takeaway-box"></icon-btn>-->
    <!--    </el-tooltip>-->
    <!--    <icon-btn icon="far fa-edit" @click="$emit('toEdit')"></icon-btn>-->
    <el-popover placement="bottom-end" width="200" trigger="click">
      <note-info :note="cur_item"></note-info>
      <icon-btn icon="fal fa-info-circle" slot="reference"></icon-btn>
    </el-popover>
  </div>
</template>

<script>
import IconBtn from "@/components/IconBtn";
import NoteInfo from "@/components/note/NoteInfo";

export default {
  name: 'RevTopBar',
  components: {IconBtn, NoteInfo},
  props: ["revItems", "cur_item"],
  methods: {},
  computed: {
    stepIndex() {
      return this.revItems.indexOf(this.cur_item) + 1
    }
  },
  data() {
    return {}
  }

}
</script>

<style scoped>
.RevTopBar {
  display: flex;
  /*border: 1px red solid;*/
}


.stepper_wrapper {
  text-align: center;
  flex-grow: 1;
  color: grey;
  /*font-size: small;*/
}

.stepper {
  cursor: default;
  user-select: none;
  /*border: 1px red solid;*/
  padding: 0 5px;
}

.stepper_btn {
  cursor: default;
}

.stepper_btn:hover {
  text-decoration: underline;
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


</style>
