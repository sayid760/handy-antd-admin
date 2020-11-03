<template>
    <div class="content">
       <a-row :gutter="[15, 15]">
            <a-col :span="12">
                <line-1 />
            </a-col>
            <a-col :span="12">
                <line-2 />
            </a-col>
        </a-row>
        <a-row :gutter="[15, 15]">
            <a-col :span="12">
                <line-3 />
            </a-col>
            <a-col :span="12">
                <line-4 />
            </a-col>
        </a-row>
    </div>
</template>

<script>
import { onMounted } from 'vue'
import line1 from './component/line_1.vue'
import line2 from './component/line_2.vue'
import line3 from './component/line_3.vue'
import line4 from './component/line_4.vue'

// import Logo from "./component/logo.vue"
export default {
    components: {
        line1,
        line2,
        line3,
        line4
    },
    setup() {
        onMounted(()=>{
            //  解决全部echart超出容器宽度问题
            setTimeout(()=>{
                dispatchEvent(new Event('resize'))
            })
        })
    }
}

</script>

<style lang="scss" scoped>

</style>