<template lang="pug">
	.wrappermain
		.mainp
			br
			br
			.content
				p.is-size-1.has-text-black
					| Frequently Asked Questions
			article.message
				.message-header
					p What is ParkSpot ?
				.message-body
					p
						| ParkSpot is a smart parking platform, where you can search and book
						| a parking spot at your desired location or in your vicinity.
						| ParkSpot also supports long term parking and rental parkings.
						| ParkSpot relies on new technology and software that allows you
						| to monitor your vehicle in realtime post parking your vehicle in the
						| parking spot.
			article.message
				.message-header
					p Why do I need to add my vehicle number at the time of booking? Is it safe ?
				.message-body
					p
						| We require your vehicle number just to make the post booking process
						| more convenient. You dont need to wait for a parking operator to just to register
						| your vehicle numbers manually. The systems will detect your car when it enter
						| the parking site and from then you'll get a video stream to monitor your car
						|
						| We dont share your personal details no matter what. We'll keep that our secret.
			article.message
				.message-header
					p How can your platform help me? How safe is your platform ?	
				.message-body
					p
						| The problem that people in urban areas face is, where do they find a parking space?
						| We list the safest parking sites and show you the parking places you can visit.
						| We desire to be the goto place for parking sites. We've used state of the art
						| technologies to solve all your problems regarding the parking site question.
						|
						| We have built the entire platform while pushing security and transparency to the limit.
						| You can monitor your vehicle at realtime for the peace of your mind.
			article.message
				.message-header
					p Does ParkSpot support cashless and no contact bookings ?
				.message-body
					p
						| Yes ParkSpot supports cashless modes of payments and you can book a parking site
						| and park your vehicle at your allocated spot without having to contact a person
						| in person or any other mode.
			br
			br
</template>
<script>
	export default{
		name: 'PSFaq'
	}
</script>
<style scoped>
.mainp{
	margin: 0 auto;
	width: 80%;

}
.wrappermain{
	background: hsl(48, 100%, 67%);
}
</style>
