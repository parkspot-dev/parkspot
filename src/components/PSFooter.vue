 <template >

 <div class="footer footer has-background-black">
	 <div class=" content has-text-centered">
		 <div class="container is-fluid">
			 <div class="columns is-vcentered is-centered is-multiline px-6 mx-6">
				 <div class=" column center is-12-mobile is-4" v-for="(elem, i) in bottomicons" :key="i">
					 <a :href="`${elem.href}`"  alt="social handle icons" v-lazyload>
						 <img :data-url="elem.image" class="footericons">
					 </a>
				 </div>
			 </div>
			 <br>
			 <router-link :to="{ name:'Terms'}"> Terms and Conditions</router-link>
			 <br>
			 <br>
			 <p class="has-text-white">
				 <span>© 2020 </span>
				 <span class="strong has-text-white">The Thought Engine</span>
				 <span>- All rights reserved.</span>
			 </p>
		 </div>
	 </div>
	 
 </div>
	<!-- footer.footer.has-background-black
		.content.has-text-centered
			.container.is-fluid
				.columns.is-vcentered.is-centered.is-multiline.px-6.mx-6
					.column.center.is-12-mobile.is-4(v-for="(elem, i) in bottomicons" :key="i")
						a(:href="`${elem.href}`" alt="social handle icons" v-lazyload)
							img(class="footericons" :data-url="elem.image")
					
			br
			a(tag="router-link" :to="{ name: 'Terms' }") link
			br
			br
			p.has-text-white
				|© 2020 
				strong.has-text-white The Thought Engine 
				|- All rights reserved.

		router-view -->
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
		},		
	}
</script>
<style scoped>
	.footericons{
		width: 50px;
	}
</style>
