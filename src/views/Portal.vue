<template>
	<div id="app">
		<PSNavbar />
		<PSPortal />
		<PSFooter />
	</div>
</template>
<script>
import PSPortal from '@/pages/Portal/components/PSPortal.vue';
import PSFooter from '@/components/PSFooter.vue';
import PSNavbar from '@/components/PSNavbar.vue'
export default{
	name: 'Portal',
	components: {
		PSPortal,
		PSFooter,
		PSNavbar
	}
}
</script>
<style>
</style>