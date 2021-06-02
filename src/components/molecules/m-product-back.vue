<template>
    <div class="m_product_back">
        <atom-b-subtitle :text="title"/>
        <atom-text :text="text"/>
    </div>
</template>

<script>
import atomBSubtitle from '@/components/atoms/atom-text/atom-b-subtitle.vue'
import AtomText from '@/components/atoms/atom-text/atom-text.vue'
export default {
  components: { atomBSubtitle, AtomText },
    name:"m-product-back",

    data(){
        return{
            title:"Parkspot for malls",
            text:"Digitized parking space for better monetization and a seamless customer experience."
        }
    }

}
</script>