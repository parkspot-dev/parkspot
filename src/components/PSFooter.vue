 <template lang="pug">
	footer.footer
		.content.has-text-centered
			.footercontainer
				.containersocial
					//.columns.bottomicons.inline
					//	.column.is-one-third(v-for="(elem, i) in bottomicons" :key="i")
					//		a(:href="`${elem.href}`")
					//			img(class="footericons" :src="`${elem.image}`")
				br
				p
				|© 2020 
				strong The Thought Engine 
				|- All rights reserved.
</template>
<script>
	export default{
		name: "PSFooter",
		data: function(){
			return {
				"bottomicons":[
					{ image: require("../assets/sites/playstoreMini.png"), href: "https://play.google.com/store/apps/details?id=com.parkspot.parkspot"},
					{ image: require("../assets/sites/linkedin.png"), href: "https://www.linkedin.com/company/parkspot-in"},
					{ image: require("../assets/sites/twitter.png"), href: "https://twitter.com/sud_ambastha"},
				]
			}
		}
	}
</script>
<style scoped>
	.footericons{
		width: 50px;
	}
	.inline{
		display: inline;
		margin: 0 auto;
	}
	.bottomicons{
		width: 20%;
	}
</style>
