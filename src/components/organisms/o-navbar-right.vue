<template>
    <div class="o_navbar_right">
        <atom-router-link :text="text1" :link="link1"/>
        <atom-router-link :text="text2" :link="link2"/>
        <atom-router-link :text="text3" :link="link3"/>
        <atom-router-link :text="text4" :link="link4"/>
        <!-- <atom-router-link :text="text5" :link="link5"/> -->
    </div>
</template>

<script>
import AtomRouterLink from '../atoms/atom-link/atom-router-link.vue'
export default {
  components: {AtomRouterLink },
    name:"o-navbar-right.vue",
    data(){
        return{
            text1:"Home",
            link1:"Home",
            text2:"About",
            link2:"#About",
            text3:"Features",
            link3:"#Features",
            text4:"Blog",
            link4:"EliminateTrafficJam",

        }
    }
}
</script>