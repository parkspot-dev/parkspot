<template lang="pug">
    b-navbar
      template(slot='brand')
        b-navbar-item(href="/")
          img(:src='`${minilogo.path}`' alt='ParkSpot')
        b-navbar-item(href="/")
          p.is-size-4.is-black
            | ParkSpot
      template(slot='end')
        b-navbar-item(tag='div')
          .buttons
            a.button.is-dark
              strong Sign up
            a.button.is-warning(@click="cardModal()")
              strong Log in
</template>

<script>
import ModalForm from './ModalForm.vue'

export default {
  name: 'Topbar',
	methods: {
		cardModal() {
				console.log("hello")
                this.$buefy.modal.open({
                    parent: this,
                    component: ModalForm,
                    hasModalCard: true,
                    customClass: 'custom-class custom-class-2',
                    trapFocus: true
                })
    }
	},
	data (){
		return {
			minilogo: {path: require("../assets/mini.png")}
		}
	} 
};
</script>

<style scoped>
.is-dark{
	background: white; 
}
</style>
