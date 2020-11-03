<template>
    <div class="content">
       <a-row :gutter="[15, 15]">
            <a-col :span="12">
                <column-1 />
            </a-col>
           <a-col :span="12">
                <column-2 />
            </a-col> 
        </a-row>
        <a-row :gutter="[15, 15]">
            <a-col :span="12">
                <column-3 />
            </a-col>
            <a-col :span="12">
                <column-4 />
            </a-col>
        </a-row>
    </div>
</template>

<script>
import { onMounted } from 'vue'
import column1 from './component/column_1.vue'
import column2 from './component/column_2.vue'
import column3 from './component/column_3.vue'
import column4 from './component/column_4.vue'

export default {
    components: {
        column1,
        column2,
        column3,
        column4,
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