<template>
  <div id="app">
    <vxe-toolbar>
      <template #buttons>
        <vxe-button @click="clearDataEvent">清空数据</vxe-button>
        <vxe-button @click="importDataEvent">导入数据</vxe-button>
        <vxe-button @click="validEvent">校验数据</vxe-button>
        <vxe-button @click="upload">上传数据</vxe-button>
      </template>
    </vxe-toolbar>

    <vxe-table
      ref="xTable"
      :edit-rules="validRules"
      keep-source
      :row-config="{ isHover: true }"
      :export-config="{}"
      :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
      :data="tableData"
    >
      <vxe-column type="seq" width="60"></vxe-column>
      <vxe-column
        field="证书编号"
        :edit-render="{ name: 'input' }"
        title="证书编号"
      ></vxe-column>
      <vxe-column
        field="证书名称"
        :edit-render="{ name: 'input' }"
        title="证书名称"
      ></vxe-column>
      <vxe-column
        field="证书类型"
        :edit-render="{ name: 'input' }"
        title="证书类型"
      ></vxe-column>
      <vxe-column
        field="有效"
        :edit-render="{ name: 'input' }"
        title="有效"
      ></vxe-column>
      <vxe-column
        field="生效日期"
        title="生效日期"
        :edit-render="{ name: 'input' }"
      ></vxe-column>
      <vxe-column
        field="失效日期"
        title="失效日期"
        :edit-render="{ name: 'input' }"
      ></vxe-column>
    </vxe-table>
  </div>
</template>

<script>
import { read, utils } from "xlsx";
import XEUtils from "xe-utils";
import VXETable from "vxe-table";

export default {
  data() {
    return {
      code: "",
      tableData: [],
      validRules: {
        证书编号: [{ required: true, message: "证书编号必填" }],
        证书名称: [{ required: true, message: "证书名称必填" }],
        证书类型: [
          { required: true, message: "证书类型必填" },
          {
            validator({ cellValue }) {
              if ([1, 2, 3, 4].includes(Number(cellValue))) {
                return true;
              }
              return new Error("证书类型必须为1,2,3,4");
            },
            message: "证书类型必须是1,2,3,4其中一个值",
          },
        ],
        有效: [
          { required: true, message: "有效字段必填" },
          {
            validator({ cellValue }) {
              if ([0, 1].includes(Number(cellValue))) {
                return true;
              }
              return new Error("有效字段必须是1或0");
            },
            message: "有效字段必须是1或0",
          },
        ],
        生效日期: [
          { required: true, message: "生效日期必填" },
          {
            validator({ cellValue }) {
              const data = new Date(cellValue);
              if (data instanceof Date && !isNaN(data.getTime())) {
                return true;
              }
              return new Error("日期格式错误");
            },
            message: "日期格式错误",
          },
        ],
        失效日期: [
          { required: true, message: "失效日期必填" },
          {
            validator({ cellValue }) {
              const data = new Date(cellValue);
              if (data instanceof Date && !isNaN(data.getTime())) {
                return true;
              }
              return new Error("日期格式错误");
            },
            message: "日期格式错误",
          },
        ],
      },
    };
  },
  methods: {
    async upload() {
      await this.validEvent();
      const { fullData } = this.$refs.xTable.getTableData();
      if(fullData.length){
        VXETable.modal.message({message: "数据已打印在控制台"})
        console.log("上传的数据");
        console.log(JSON.stringify(fullData, null, 2));
      }
    },
    async validEvent() {
      const errMap = await this.$refs.xTable
        .fullValidate(true)
        .catch((errMap) => errMap);
      if (errMap) {
        VXETable.modal.message({ status: "error", content: "校验不通过！" });
        return Promise.reject(errMap);
      } else {
        VXETable.modal.message({ status: "success", content: "校验成功！" });
      }
    },
    formatTime(cellValue) {
      const r = new Date("1900-01-01");
      r.setDate(r.getDate() + cellValue - 2);
      return XEUtils.toDateString(r, "yyyy-MM-dd");
    },
    clearDataEvent() {
      this.tableData = [];
    },
    exportDataEvent() {
      this.$refs.xTable.openExport({
        // 默认勾选源
        original: true,
      });
    },
    async importDataEvent() {
      const { file } = await this.$refs.xTable.readFile({
        types: ["csv", "html", "xml", "txt", "xlsx"],
      });

      const reader = new FileReader();
      reader.readAsBinaryString(file);

      reader.onload = (e) => {
        const data = e.currentTarget.result;
        const wb = read(data, { type: "binary" });
        var j_data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

        // 数据清洗
        this.$refs.xTable.loadData(
          j_data.map((item) => {
            return {
              ...item,
              失效日期: this.formatTime(item.失效日期),
              生效日期: this.formatTime(item.生效日期),
            };
          })
        );
      };
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
