 <template lang="pug">
	footer.footer#black
		.content.has-text-centered
			.footercontainer
				.containersocial
					.columns.bottomicons
						.column.is-one-third(v-for="(elem, i) in bottomicons" :key="i")
							a(:href="`${elem.href}`")
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
	.containersocial{
		margin: auto;
		width: 50%;
	}
	/*
	.bottomicons{
		width: 20%;
	}
	*/
	#black{
		background: black;
	}
</style>
