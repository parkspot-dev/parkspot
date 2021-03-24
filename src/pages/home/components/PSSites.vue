<template lang="pug">
	.hero.is-fullheight.is-black#book
		.hero-body
			.columns.is-vcentered.is-centered
				.column.is-one-quarter
					p.title.has-text-white
						| Our best picks
				.column.is-one-quarter
					.card.team
						.card-image
							figure.image.is-4by3
								img(:src="`${kolkata}`")
						.card-content
							.media
								.media-content
									p.title.is-4.has-text-black Kolkata
									p.subtitle.is-6.has-text-black @Ballygunge
							.content
								| 129, KN Sen Rd, 
								| New Ballygunge, 
								| Kasba, Kolkata, 
								| West Bengal 700042
						.card-footer
							.card-footer-item
								a.button.is-dark(href="#contact" id="Kolkata") Book
				.column.is-one-quarter
					.card.team
						.card-image
							figure.image.is-4by3
								img(:src="`${chennai}`")
						.card-content
							.media
								.media-content
									p.title.is-4.has-text-black Chennai
									p.subtitle.is-6.has-text-black @Pallikaranai
							.content
								| Apartment name: Newry Shanmitha, 
								| 1st floor, 1b- 105, Block 1, 
								| Bharathiyar salai, 
								| Pallikaranai Chennai -600100
						.card-footer
							.card-footer-item
								a.button.is-dark(href="#contact" id="Chennai") Book
				.column.is-one-quarter
					.card.team
						.card-image
							figure.image.is-4by3
								img(:src="`${bangalore}`")
						.card-content
							.media
								.media-content
									p.title.is-4.has-text-black Bangalore
									p.subtitle.is-6.has-text-black @RTNagar
							.content
								| Hani elegance RT Nagar
						.card-footer
							.card-footer-item
								a.button.is-dark(href="#contact" id="Bangalore") Book

</template>
<script>
export default{
	name: "PSSites",
	data (){
		return {
			bangalore: require("@/assets/psites/bang.jpeg"),
			chennai: require("@/assets/psites/ch.jpeg"),
			kolkata: require("@/assets/psites/kol.jpeg")
		}
	}
}
</script>
<style>
</style>
