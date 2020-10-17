<template lang="pug">
    b-navbar.is-fixed-top
      template(slot='brand')
        b-navbar-item(href="/")
          img(:src='`${minilogo.path}`' alt='ParkSpot')
        b-navbar-item(href="/")
          p.is-size-4.is-black
            | ParkSpot
      template(slot='end')
        b-navbar-item(href="#services")
          | Services
        b-navbar-item(href="#team")
          | Team
        b-navbar-item(href="#book")
          | Book
        b-navbar-item(href="#Rent")
          | Rent
        b-navbar-item(href="#faq")
          | FAQs
        b-navbar-item(href="#about")
          | About
        b-navbar-item(href="#contact")
          | Contact
</template>

<script>
export default {
  name: 'PSNavbar',
	data (){
		return {
			minilogo: {path: require("../assets/mini.png")}
		}
	} 
};
</script>

<style scoped>
.is-dark{
	background: grey; 
}
</style>
