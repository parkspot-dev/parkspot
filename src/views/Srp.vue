<template>
	<section>
		<PSNavbar />
		<SRP />
		<PSSrpDetails />
		<PSFooter />
	</section>
</template>
<script>
import PSNavbar from '@/components/PSNavbar.vue';
import PSFooter from '@/components/PSFooter.vue';
import SRP from '@/pages/srp/components/PSSrp.vue';
import PSSrpDetails from '@/pages/srp/components/PSSrpDetails.vue'
export default{
	name: "PSSrp",
	components: {
		PSNavbar,
		PSFooter,
		SRP,
		PSSrpDetails
	} 
}
</script>
