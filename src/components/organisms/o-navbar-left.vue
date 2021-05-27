<template>
    <div class="o-navbar-left">
        <atom-img :src="src1"/>
        <atom-img :src="src2" :width="180" :height="64"/>
    </div>
</template>

<script>
import atomImg from '@/components/atoms/atom-img/atom-img.vue'
export default {
  components: { atomImg },
    name:"o-navbar-vue",
    data(){
        return{
            src1:require("@/assets/img/pstopmini.png"),
            src2:require("@/assets/img/pstoptext.png")
        }
    }

}
</script>