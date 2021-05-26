<template>
    <div class="m_footer_right">
        <atom-text :text="text1"/>
        <atom-text :text="text2"/>
        <atom-text :text="text3"/>
    </div>
</template>

<script>
import AtomText from '@/components/atoms/atom-text/atom-text.vue'
export default {
    name:'m-footer-right',
    data(){
        return{
            text1:"+91 80929 96057",
            text2:"connect@parkspot.in",
            text3:"2nd Floor, Nextcoworks BTM Layout, BTM 2nd Stage, Bengaluru, Karnataka 560076"
        }
    },
    components:{
        AtomText

    }
}
</script>