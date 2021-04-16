 <template lang="pug">
	footer.footer.has-background-black
		.content.has-text-centered
			.container.is-fluid
				.columns.is-vcentered.is-centered.is-multiline.px-6.mx-6
					.column.center.is-12-mobile.is-4(v-for="(elem, i) in bottomicons" :key="i")
						a(:href="`${elem.href}`" alt="social handle icons")
							img(class="footericons" :src="`${elem.image}`")
						
			br
			p.has-text-white
				|© 2020 
				strong.has-text-white The Thought Engine 
				|- All rights reserved.
</template>
<script>
	export default{
		name: "PSFooter",
		data: function(){
			return {
				"bottomicons":[
					{ image: require("../assets/sites/playstoreMini.png"), href: "https://play.google.com/store/apps/details?id=com.parkspot.maya_nagri"},
					{ image: require("../assets/sites/linkedin.png"), href: "https://www.linkedin.com/company/parkspot-in"},
					{ image: require("../assets/sites/facebook.png"), href: "https://facebook.com/parkspot.in"},
				]
			}
		}
	}
</script>
<style scoped>
	.footericons{
		width: 50px;
	}
</style>
