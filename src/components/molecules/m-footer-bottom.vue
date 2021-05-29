<template>
    <div class="m_footer_bottom columns is-mobile">
        <atom-text id="ps__text" class="column" :text="text1"/>
        <atom-link id="ps__text" class="column " :text="text2" />
    </div>
</template>

<script>
import AtomLink from '@/components/atoms/atom-link/atom-link.vue'
import atomText from '@/components/atoms/atom-text/atom-text.vue'
export default {
  components: { atomText, AtomLink },
    name:'m-footer-bottom',
    data(){
        return{
            text1:"© 2021 NeoSpot Pvt Ltd.- ALL RIGHTS RESERVED",
            text2:"Terms and Conditions"
        }
    }

}
</script>

<style scoped>
#ps__text{
    font-size:13px;
}
</style>