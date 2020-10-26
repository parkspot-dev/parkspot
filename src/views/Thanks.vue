<template>
	<div id="app">
		<PSNavbar />
		<PSThanks />
		<PSFooter />
	</div>
</template>
<script>
import PSThanks from '@/pages/thanks/components/PSThanks.vue';
import PSNavbar from '@/components/PSNavbar.vue';
import PSFooter from '@/components/PSFooter.vue';
export default{
	name: 'Thanks',
	components: {
		PSThanks,
		PSNavbar,
		PSFooter
	}, 
}
</script>
<style>
</style>
