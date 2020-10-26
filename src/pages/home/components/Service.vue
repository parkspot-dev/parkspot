<template lang="pug">
	.containerz
		div(v-for="(service, i) in services" :key="i" id="services")
			section(:class="`hero is-fullheight is-${service.color}`")
				.hero-body.has-centered-text
					.columns.is-vcentered
						.column.is-half
							.column(v-if="service.color === 'warning'")
								h1.title.has-text-black
									| {{service.title}}
								br
								h2.subtitle.has-text-black
									| {{service.subtitle}}
								p.has-text-black
									| {{service.text}}
							.column(v-else)
								h1.title
									| {{service.title}}
								br
								h2.subtitle
									| {{service.subtitle}}
								p.has-text-white
									| {{service.text}}
						.column.is-half
							img(:src="`${service.image}`")
</template>
<script>
export default {
	name: "Service",
	data (){
		return {
			services: [
				{	title: "Join ParkSpot platform as a parking operator",
					subtitle: "Want to reach new customers?",
					text: "Not getting enough customers? Spending too much on billboards but still not reaching customers? Try parkspot.in to list your parking sites on our platform for reaching a bigger customer base",
					image: require("@/assets/services/operator.png"),
					color: "black"
				},
				{	title: "Join ParkSpot as an individual",
					subtitle: "Looking for new ways to make money?",
					text: "Try parkspot.in to list/rent your parking space in our platform for extra income",
					image: require("@/assets/services/owner.png"),
					color: "warning"
				}
			]
		}
	}
}
</script>
