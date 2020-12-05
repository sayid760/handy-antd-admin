import {markRaw} from 'vue'
import AccessTree from './components/access-tree.vue'
import { FormSchema } from '/@/components/form/index'
import {getRoleAccess} from "/@/api/system"

export const addSchema: FormSchema = {
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
            label: "角色名称",
            field: "roleName",
            value: '',
            props: {
                placeholder: "请输入角色名称"
            },
            rules: [
                {
                    required: true,
                    message: "角色名称不能为空"
                }
            ]
        },
        {
            type: "textarea",
            label: "描述",
            field: "roleCode",
            value: "",
            props: {
                placeholder: "角色描述"
            }
        },
        {
            type: markRaw(AccessTree),
            label: "资源",
            field: "accessIdsList",
            value: [],
            asyncValue: async (currentValue, formInstance) => {
                const {id} = formInstance?.props.fields as any
                // 获取角色列表
                const res = await getRoleAccess(id)
                console.log(res)
                // 设置角色复选框选项
                return res.result.map(item => item.accessId)
            }
        }
    ]
}

