<template>
  <a-modal
      title="编辑账号"
      v-model:visible="visible"
      :confirm-loading="confirmLoading"
      :afterClose="remove"
      @ok="handleOk"
  >
    <SchemaForm  ref="dynamicForm"  :fields="{...fields, roles:fields?.roleId }" :dynamic-validate-form="dynamicValidateForm" />
    <!-- :fields="{...fields,roles:fields?.roles.map(item => item.userId)}"  -->
  </a-modal>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, ref, onMounted} from 'vue'
import {Modal} from 'ant-design-vue'
import {useAsync} from "/@/hooks"
import {SchemaForm} from '/@/components/JSON-schema-form/index'
import { BasicForm, FormSchema } from '/@/components/form/index'
import { getRolePage, updateUser} from "/@/api/system"

export const editSchema: FormSchema = {
    style: {
        width: "auto"
    },
    formItemLayout: {
        labelCol: {
            span: 4
        },
        wrapperCol: {
            span: 20
        }
    },
    formItem: [
        {
            type: "input",
            label: "用户名",
            field: "name",
            value: '',
            props: {
                disabled: true,
                placeholder: "请输入用户名"
            },
            rules: [
                {
                    required: true,
                    message: "用户名不能为空"
                }
            ]
        },
        {
            type: "checkbox",
            label: "角色",
            field: "roles",
            value: [],
            options: [],
            loading: true,
            asyncOptions: async () => {
                // 获取角色列表
                const res = await getRolePage()
                // console.log(res)
                return res.result.records.map(item => ({
                    label: item.roleName,
                    value: item.roleId
                }))
            }
        }
    ]
}


export default defineComponent({
  name: "edit-modal",
  components: { [Modal.name]: Modal, SchemaForm},
  props: {
    remove: { // 移除模态框
      type: Function
    },
    fields: {
      type: Object
    },
    callback: {
      type: Function
    }
  },
  setup(props) {
    const dynamicForm = ref<any>(null)

    const state = reactive({
      visible: true,
      confirmLoading: false,
      dynamicValidateForm: editSchema
    })

    const handleOk = async () => {
      state.confirmLoading = true;
      dynamicForm.value.validate()
          .then( async res => {
            const {username, roles} = dynamicForm.value.modelRef

            const params = {
              username,
              roles: roles.toString()
            }
            const result = await useAsync(updateUser(props.fields?.id, params), {ref: state, loadingName: 'confirmLoading'})
            state.visible = false;
            props.callback && props.callback()
          })
          .catch(err => {
            console.log('error', err)
            state.confirmLoading = false
          });
    }

    return {
      ...toRefs(state),
      handleOk,
      dynamicForm,
    }
  }
})
</script>

<style scoped>
</style>
