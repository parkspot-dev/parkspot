<template>
	<div id="home">
		<PSNavbar />
		<t-footer/>
	</div>
</template>
<script>
import PSNavbar from '@/components/PSNavbar.vue'
import TFooter from '@/components/templates/t-footer.vue'
export default{
	name: 'Home',
	components: {
		PSNavbar,
		TFooter
	}
}
</script>
<style>
</style>