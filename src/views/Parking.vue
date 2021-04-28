<template>
	<div id="app">
		<PSNavbar />
        <PSParking />
		<PSFooter />
	</div>
</template>
<script>
import PSFooter from '@/components/PSFooter.vue';
import PSNavbar from '@/components/PSNavbar.vue'
import PSParking from '../pages/Parking/components/PSParking.vue'
export default {
    name: 'Parking',
    components:{
        PSNavbar,
        PSFooter,
        PSParking
    }
}
</script>
