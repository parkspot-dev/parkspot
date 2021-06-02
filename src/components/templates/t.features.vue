<template>
    <section class="t_features">
        <atom-b-title :text="title" />
        <div class="columns">
            <atom-img class="column" />
            <o-features-details class="column"/>
        </div>
    </section>
</template>

<script>
import atomBTitle from '@/components/atoms/atom-text/atom-b-title.vue'
import AtomImg from '@/components/atoms/atom-img/atom-img.vue'
import OFeaturesDetails from '@/components/organisms/o-features-details.vue'
export default {
  components: { atomBTitle,AtomImg,OFeaturesDetails },
    name:'t-features',
    data(){
        return{
            title:"ParkSpot Features",
        }
    }
}
</script>