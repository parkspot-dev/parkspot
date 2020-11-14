<template>
    <div id="app">
		<PSNavbar />
		<SRP />
		<PSFooter />
	</div>
</template>
<script>
import PSNavbar from '@/components/PSNavbar.vue';
import PSFooter from '@/components/PSFooter.vue';
import SRP from '@/pages/srp/components/PSSrp.vue';

export default{
	name: "PSSrp",
	components: {
		PSNavbar,
		PSFooter,
		SRP
	} 
}
</script>
