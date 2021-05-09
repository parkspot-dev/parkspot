<template>
	<div id="app">
		<PSNavbar />
		<PSTerms />
		<PSFooter />
	</div>
</template>
<script>
import PSFooter from '@/components/PSFooter.vue';
import PSNavbar from '@/components/PSNavbar.vue';
import PSTerms from '@/pages/Policy/PSTerms.vue'
export default{
 name: "Terms",
	components: {
		
		PSNavbar,
    PSTerms,
		PSFooter,
	}
}
</script>
<style>
</style>