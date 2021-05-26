<template>
<div class="m_footer_middle">
<atom-text :text="text1"/>
    <atom-text :text="text2"/>
</div>
    
</template>

<script>
import atomText from '@/components/atoms/atom-text/atom-text.vue'
export default {
  components: { atomText },
    name:'m-footer-middle',
    data(){
        return{
            text1:"Now Available on",
            text2:"Follow us"
        }
    }
}
</script>