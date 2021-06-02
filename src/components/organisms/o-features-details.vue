<template>
    <div class="o_features_details">
        <atom-b-subtitle :text="subtitle"/>
        <atom-text :text="text"/>
    </div>
</template>

<script>
import AtomBSubtitle from '@/components/atoms/atom-text/atom-b-subtitle.vue'
import atomText from '@/components/atoms/atom-text/atom-text.vue'
export default {
  components: { atomText ,AtomBSubtitle},
    name:"o-features-details.vue",
    data(){
        return{
        }
    },
    props:{
        subtitle:String,
        text:String
    }
  }
</script>