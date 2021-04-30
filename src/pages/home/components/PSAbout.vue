<template lang="pug">
	.hero.is-fullheight.is-dark#book
		.hero-body
			.columns.is-vcentered.tengine
				.column.is-half(v-lazyload)
					img(:data-url="aboutimg" class="aboutbanner" class="team")
				.column.is-half
					h1.title.has-text-light About ParkSpot
					br
					p.subtitle.has-text-light
						| We at ParkSpot strive to solve the trivial problem of finding/booking 
						| available parking slots in vicinity which is faced by millions of people on a daily basis. 
						| we vie for solutions which brings technology and life closer and accessible.
					br
					p.subtitle.has-text-light
						| ParkSpot is part of this new initiative and incorporates various features aimed at improving
						| the parking experience for residents and visitors.
						| These will include removing the need for entry barriers at car park entrances and exits for a seamless flow of traffic,
						| as vehicle plates will be registered via cameras.
					br
					p.has-text-white.has-text-weight-semibold
						| "When the need for something becomes imperative, you are forced to find ways of getting or achieving it. - lexico.com"
</template>
<script>
export default{
	name: "PSAbout",
	data (){
		return {
			aboutimg: require("@/assets/aboutimg.png")
		}
	}
}
</script>
<style>
</style>
