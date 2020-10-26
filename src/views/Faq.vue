<template>
	<div id="app">
		<PSNavbar />
		<PSFaq />
		<PSFooter />
	</div>
</template>
<script>
import PSFaq from '@/pages/faq/components/PSFaq.vue';
import PSNavbar from '@/components/PSNavbar.vue';
import PSFooter from '@/components/PSFooter.vue';
export default{
	name: 'Faq',
	components: {
		PSFaq,
		PSNavbar,
		PSFooter
	}, 
}
</script>
<style>
</style>
