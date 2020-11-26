<template>
	<div id="app">
		<PSNavbar />
		<BlogOne />
		<PSFooter />
	</div>
</template>
<script>
import BlogOne from '@/pages/blogs/components/Blog1.vue';
import PSNavbar from '@/components/PSNavbar.vue';
import PSFooter from '@/components/PSFooter.vue';
export default{
	name: 'Faq',
	components: {
		BlogOne,
		PSNavbar,
		PSFooter
	}, 
}
</script>
<style>
</style>
