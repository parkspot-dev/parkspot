<template lang="pug">
	div(class="hero is-black is-fullheight" id="team")
		div(class="hero-head")
			.hero-body
				.columns.is-vcentered
					.column.is-one-fifth
						p.title Our Team
					.column.is-one-fifth(v-for="(team, i) in teamMates" :key="i")
						.card.team
							.card-image
								figure.image.is-128x128
									img(:src="`${team.dp}`")
							.card-content
								.media
									.media-left
										figure.image.is-48x48
											img(:src="`${parkspot}`")
									.media-content
										p.title.is-4.has-text-black
											| {{team.name}} 
										p.subtitle.is-6.has-text-black
											| {{team.username}}
								.content
									.columns.is-centered.is-vcentered
										.column.is-one-third
											a(:href="`${team.git}`")
												img(:src="`${github}`" class="image is-48x48")
										.column.is-one-third
											a(:href="`${team.linkedin}`")
												img(:src="`${linkedin}`" class="image is-48x48")
										.column.is-one-third
											a(:href="`${team.twitter}`")
												img(:src="`${twitter}`" class="image is-48x48")
</template>
<script>
  export default {
    name: 'PSTeam',
		data(){
			return {
				linkedin: require("../assets/sites/linkedin.png"),
				github: require("../assets/sites/github.png"),
				twitter: require("../assets/sites/twitter.png"),
				parkspot: require("../assets/mini.png"),
				teamMates: [
					{ name: "Sudhanshu Kr. Ambastha", 
						dp: require("../assets/team/sud.jpg"), 
						git: "https://www.github.com/arrogant-ant", 
						linkedin: "https://www.linkedin.com/in/sudhanshu-ambastha/",
						twitter: "https://twitter.com/sud_ambastha",
						username: "@arrogant-ant"
					},
					{ name: "Ishwar Kumar", 
						dp: require("../assets/team/ish.jpg"), 
						git: "https://www.github.com/nextishwar", 
						linkedin: "https://www.linkedin.com/in/ishwar-kumar-50403a130/",
						twitter: "https://twitter.com/nextishwar",
						username: "@nextishwar"
					},
					{ name: "Nikhil Surya Mukhi", 
						dp: require("../assets/team/nik.jpg"), 
						git: "https://www.github.com/iamfiasco", 
						linkedin: "https://www.linkedin.com/in/iamfiasco/",
						twitter: "https://twitter.com/NikhilSuryaMuk1",
						username: "@iamfiasco"
					},
					{ name: "Shubham Choudhary", 
						dp: require("../assets/team/sub.jpg"), 
						git: "https://www.github.com/subhamjpc", 
						linkedin: "https://www.linkedin.com/in/shubham-choudhary-391942101",
						twitter: "https://twitter.com/shubhamjpc?s=09",
						username: "@shubhamjpc"
					}
				]
			}
		}
  }
</script>
