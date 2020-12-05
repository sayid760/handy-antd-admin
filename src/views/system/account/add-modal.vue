<template>
  <a-modal
      title="新增账号"
      v-model:visible="visible"
      :confirm-loading="confirmLoading"
      :afterClose="remove"
      @ok="handleOk"
  >
  <SchemaForm ref="dynamicForm" :dynamic-validate-form="dynamicValidateForm" />
  </a-modal>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted, ref} from 'vue'
import {Modal} from 'ant-design-vue'
import {useAsync} from "/@/hooks"
import {SchemaForm} from '/@/components/JSON-schema-form/index'
import { BasicForm, FormSchema } from '/@/components/form/index'
import {getRolePage, saveUser} from "/@/api/system"

export const addSchema: FormSchema = {
    formItem: [
        {
            type: "input",
            label: "用户名",
            field: "username",
            value: '',
            props: {
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
            type: "input",
            label: "密码",
            field: "password",
            value: "",
            props: {
                type: 'password',
                placeholder: "请输入密码"
            },
            rules: [
                {
                    "required": true,
                    "message": "密码不能为空"
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
                return res.result.records.map(item => ({
                    label: item.roleName,
                    value: item.roleId
                }))
            }
        }
    ]
}

export default defineComponent({
  name: "add-modal",
  components: { [Modal.name]: Modal, SchemaForm},
  props: {
    remove: { // 移除模态框
      type: Function
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
      dynamicValidateForm: addSchema
    })

    const handleOk = () => {
      state.confirmLoading = true;
      dynamicForm.value.validate()
          .then( async res => {
            const param = {
              ...dynamicForm.value.modelRef,
              roles: dynamicForm.value.modelRef.roles.toString()
            }
            await useAsync(saveUser(param), {ref: state, loadingName: 'confirmLoading'})
            state.visible = false;
            props.callback && props.callback()
          })
          .catch(err => {
            console.log('error', err);
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
