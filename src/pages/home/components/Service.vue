<template lang="pug">
	.containerz
		div(v-for="(service, i) in services" :key="i" id="services")
			section(:class="`hero is-fullheight is-${service.color}`")
				.hero-body.has-centered-text
					.columns.is-vcentered
						.column.is-half
							.column(v-if="service.color === 'warning'")
								h1.title.is-4.has-text-black
									| {{service.title}}
								p.has-text-black
									| {{service.subtitle}}
								br
								h1.title.is-4.has-text-black
									| {{service.title2}}
								p.has-text-black
									| {{service.subtitle2}}
							.column(v-else)
								h1.title
									| {{service.title}}
								br
								h2.subtitle.is-4
									| {{service.subtitle}}
								p.has-text-white.is-size-6
									| {{service.text}}
								br
								h2.subtitle.is-4
									| {{service.subtitle2}}
								p.has-text-white.is-size-6
									| {{service.text2}}
						.column.is-half
							img(:src="`${service.image}`")
</template>
<script>
export default {
	name: "Service",
	data (){
		return {
			services: [
				{	title: "Join ParkSpot platform as a parking owner",
					subtitle: "Want to reach new customers?",
					text: "Not getting enough customers? Spending too much on billboards but still not reaching customers? Try parkspot.in to list your parking sites on our platform for reaching a bigger customer base. We at ParkSpot will be renting your parking sites on our platform for better visibility and reach out to a bigger customer base. This will minimise your effort, increase your income and we will take care of customer’s convenience.",
					subtitle2:"ParkSpot pave the way for innovative pricing",
					text2: "ParkSpot is a dynamic approach to carry out the parking process. This dynamism is prominently observed in the pricing that the owner specify for the parking spaces. That said, the pricing depends upon the occupancy and the number of customers. If the number of people is more, you'll have to pay more and vice versa.",
					image: require("@/assets/services/operator.png"),
					color: "black"
				},
				{	title: "How ParkSpot App Improves User experience?",
					subtitle: "Congestion on roads for securing a parking spot is a familiar sight. All of us have been in that situation where an appropriate parking spot just doesn't appear. And when it does, we have to wait for the other vehicles to locomote. Even listening to sound melodies doesn't do any good during this time. After all, how can one spend more than 15 minutes in parking a car? A report claims that drivers spend over 17 hours in a year to search for a parking spot. The report takes into account streets, garages and parking spaces. Cheers! You just consumed two working days of your year in parking your car. But, we don't blame you because there is no way one can avoid congestion. Is there? \n Let's contradict the preceding assertion and introduce you to the term \"Smart Parking\".",
					title2: "ParkSpot and the Improved user experience",
					subtitle2:"The seamless combination of technology and human innovation paves the way for an effective parking solution that can save not only your money but also your time. With real-time updates and comfortable navigation, ParkSpot App is a perfect disruptor for the parking process.The best part is that you can reserve your space even before visiting the parking space. It is similar to what you do while booking seats in a movie hall. Let us look at how smart parking benefits the citizens and improves the parking experience", 					
					image: require("@/assets/services/owner.png"),
					color: "warning"
				}
			]
		}
	}
}
</script>
