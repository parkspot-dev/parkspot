<template>
	<div id="app">
		<PSNavbar />
		<BlogOne />
		<PSFooter />
	</div>
</template>
<script>
import BlogOne from '@/pages/blogs/components/Blog1.vue';
export default{
	name: 'Faq',
	components: {
		BlogOne,
	}, 
}
</script>
<style>
</style>
