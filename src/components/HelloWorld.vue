<template>
  <div>
    <vxe-toolbar>
      <template #buttons>
        <vxe-button @click="validEvent">快速校验</vxe-button>
        <vxe-button @click="fullValidEvent">完整快速校验</vxe-button>
        <vxe-button @click="selectValidEvent">选中行校验</vxe-button>
        <vxe-button @click="getSelectEvent">获取选中</vxe-button>
        <vxe-button @click="getUpdateEvent">获取修改</vxe-button>
      </template>
    </vxe-toolbar>

    <vxe-table
      resizable
      show-overflow
      keep-source
      ref="xTable"
      :edit-rules="validRules"
      :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
      :checkbox-config="{ labelField: 'id' }"
      :data="tableData"
    >
      <vxe-column type="checkbox" title="ID" tree-node></vxe-column>
      <vxe-column field="name" title="Name" :edit-render="{}">
        <template #edit="scope">
          <vxe-input
            v-model="scope.row.name"
            type="text"
            @change="$refs.xTable.updateStatus(scope)"
          ></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="size" title="Size" :edit-render="{}">
        <template #edit="scope">
          <vxe-input
            v-model="scope.row.size"
            type="text"
            @change="$refs.xTable.updateStatus(scope)"
          ></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="type" title="Type" :edit-render="{}">
        <template #edit="scope">
          <vxe-input
            v-model="scope.row.type"
            type="text"
            @change="$refs.xTable.updateStatus(scope)"
          ></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="date" title="Date" :edit-render="{}">
        <template #edit="scope">
          <vxe-input
            v-model="scope.row.date"
            type="date"
            transfer
            @change="$refs.xTable.updateStatus(scope)"
          ></vxe-input>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<script>
import VXETable from "vxe-table";

export default {
  data() {
    return {
      tableData: [
        {
          id: 10000,
          parentId: null,
          name: "",
          type: "mp3",
          size: 1024,
          date: "2020-08-01",
        }
      ],
      treeConfig: {
        transform: true,
        rowField: "id",
        parentField: "parentId",
      },
      validRules: {
        name: [
          { required: true, message: "app.body.valid.rName" },
          { min: 3, max: 50, message: "文件名长度在 3 到 50 个字符" },
        ],
      },
    };
  },
  methods: {
    async validEvent() {
      const $table = this.$refs.xTable;
      const errMap = await $table.validate().catch((errMap) => errMap);
      if (errMap) {
        VXETable.modal.message({ status: "error", message: "校验不通过！" });
      } else {
        VXETable.modal.message({ status: "success", message: "校验成功！" });
      }
    },
    async fullValidEvent() {
      const errMap = await this.$refs.xTable.fullValidate();
      if (errMap) {
        const msgList = [];
        Object.values(errMap).forEach((errList) => {
          errList.forEach((params) => {
            const { row, column, rules } = params;
            rules.forEach((rule) => {
              msgList.push(
                `${row.name} -> ${column.title} 校验错误：${rule.message}`
              );
            });
          });
        });
        VXETable.modal.message({
          status: "error",
          slots: {
            default() {
              return [
                <div class="red" style="max-height: 400px;overflow: auto;">
                  {msgList.map((msg) => {
                    return <div>{msg}</div>;
                  })}
                </div>,
              ];
            },
          },
        });
      } else {
        VXETable.modal.message({ status: "success", message: "校验成功！" });
      }
    },
    async selectValidEvent() {
      const $table = this.$refs.xTable;
      const selectRecords = $table.getCheckboxRecords();
      if (selectRecords.length > 0) {
        const errMap = await $table
          .validate(selectRecords)
          .catch((errMap) => errMap);
        if (errMap) {
          VXETable.modal.message({ status: "error", message: "校验不通过！" });
        } else {
          VXETable.modal.message({ status: "success", message: "校验成功！" });
        }
      } else {
        VXETable.modal.message({ status: "warning", message: "未选中数据！" });
      }
    },
    getSelectEvent() {
      let selectRecords = this.$refs.xTable.getCheckboxRecords();
      VXETable.modal.alert(selectRecords.length);
    },
    getUpdateEvent() {
      let updateRecords = this.$refs.xTable.getUpdateRecords();
      VXETable.modal.alert(updateRecords.length);
    },
  },
};
</script>

<style scoped></style>
