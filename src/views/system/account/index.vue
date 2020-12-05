<template>
  <div class="content">
    <BasicTable ref="tableRef" :columns="columns" :get-list-func="getUserPage" rowKey="userId" :row-selection="rowSelection">
       <template v-slot:title>
        <!-- <a-button v-permission="{ action: 'create', effect: 'disabled' }" @click="addItem" type="primary">
          添加
        </a-button>
        <a-button @click="deleteItems" v-permission="{ action: 'delete' }" :disabled="isDisabled" type="primary">
          删除
        </a-button> -->
        <a-button @click="addItem" type="primary">添加</a-button>
        <a-button @click="deleteItems" :disabled="isDisabled" type="primary">删除</a-button>
      </template> 
    </BasicTable>
  </div>
</template>

<script lang='ts'>
import {defineComponent, onMounted, reactive, toRefs, createVNode, computed, ref} from 'vue'
import {Modal} from 'ant-design-vue'
import {QuestionCircleOutlined} from '@ant-design/icons-vue'
import {BasicTable} from '/@/components/table/index'
import {useCreateModal} from "/@/hooks"
import {deleteUsers, getUserPage} from '/@/api/system'
import {columns} from "./columns"
import AddModal from './add-modal.vue'

export default defineComponent({
  components: {
    BasicTable
  },
  setup() {
    const tableRef = ref<any>(null)

    const state = reactive({
      data: [],
      uploading: false,
      tableLoading: false,
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          state.rowSelection.selectedRowKeys = selectedRowKeys;
        },
        selectedRowKeys: []
      },
    })

    const addItem = ()=>{
      useCreateModal(AddModal, {
        callback: () => {
          // tableRef.value.refreshTableData()
        }
      })
    }
    const deleteItems = ()=>{
      // console.log(state.rowSelection.selectedRowKeys.toString())
      Modal.confirm({
        title: '提示',
        icon: createVNode(QuestionCircleOutlined),
        content: '您确定要删除所有选中吗？',
        onOk: async () => {
          await deleteUsers(state.rowSelection.selectedRowKeys.toString())
          tableRef.value.refreshTableData()
          state.rowSelection.selectedRowKeys = []
        }
      })
    }

    const isDisabled = computed(() => state.rowSelection.selectedRowKeys.length == 0)

    return {
      ...toRefs(state),
      tableRef,
      columns,
      getUserPage,
      isDisabled,
      addItem,
      deleteItems
    }
  }
})
</script>