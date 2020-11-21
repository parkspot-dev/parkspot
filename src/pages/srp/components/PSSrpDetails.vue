<template lang="pug">
	section.cont
		br
		.hero
			p.title.has-text-left
				| Results:
			.containers(v-for="(site, i) in sites" :key="i")
				.rcorner
					.columns.is-vcentered
						.column.is-half
							.image.is-1by1
								img.resultimg(:src="`${newPSSite}`")
						.column.is-half
							.grid
								.tname
									.has-text-left.is-size-7
										| {{site.type}}
									.subtitle.has-text-left
										| {{site.name}}
								.loc.has-text-left.is-size-6
									strong
										| Address: 
									| {{site.location}}
								.rate.has-text-right.is-size-6
									strong
										| Rate:
										|  
									| &#x20b9; {{site.rate}}/{{site.unit}}

				br
				.floatright
					a.button.is-warning
						| Book
				br
				br
					
</template>
<script>
export default{
	name: "PSSrpDetails",
	data: function(){
		return {
			newPSSite: require("@/assets/psites/new.png"),
			sites: [
				{
					name: "Muthumariamma Temple",
					location: "Off Kasavanahalli Main Road Off Kasavanahalli Main Road, Norbert Church Rd, Kasavanahalli, Karnataka 560035",
					latLng: [13.012172800000002, 77.6077312],
					rate: 10,
					unit: "day",
					type: "private parking"
				},
				{
					name: "Vijaya Niketan",
					location: "Vijayanikethan Apartment, Norbert Church road, Kasavanahalli, Sarjapur, Karnataka 560035",
					latLng: [12.9151665, 77.6879585],
					rate: 10,
					unit: "hour",
					type: "private parking"
				},
				{
					name: "Ittina Mahavir",
					location: "O block 102, Ittina Mahavir, Neeladri Nagar, Electronic City Phase 1, Bangalore Karnataka 560100",
					latLng: [12.8402, 77.6482],
					rate: 20,
					unit: "month",
					type: "housing society parking"
				}
			]
		}	
	},
	methods: {
		"getLatLng": function(){
			return new Promise(function(resolve, reject){
				navigator.geolocation.getCurrentPosition(function(data){
					var lat = data.coords.latitude
					var lng = data.coords.longitude
					if(lat === null && lng === null){
						reject("failed to get current position")	
					}
					else{
						resolve([lat, lng])
					}
				})	
			})
		},
		"calcDist": function(lat1, lat2, lng1, lng2,mode="K"){
			//returns distance between two lat longs in meters
			var phi1 = lat1 * Math.PI/180
			var phi2 = lat2 * Math.PI/180
			var deltaPhi = (lat2 - lat1) * Math.PI/180
			var deltaLambda = (lng2 - lng1) * Math.PI/180
			var a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
					Math.cos(phi1) * Math.cos(phi2) *
					Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2)
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
			var radius = 6371e3
			switch(mode){
				case "m":
					return radius * c
				case "K":
					return (radius * c)/1000
				case "M":
					return (radius * c) * 0.00062137
				default:
					return 0
			}
		},
		"filterDist": function(lat, lng){
			return this.sites.filter(function(elem){
				return distance(lat, elem.latLng[0], lng, elem.latLng[1]) < 60
			})	
		},
	}
}
</script>
<style scoped>
.rcorner{
	border-radius: 25px;
	border: 0.5px solid black;
	padding: 10px;
}
.cont{
	width: 80%;
	margin: 0 auto;
}
.containers{
	width: 80%;
	margin: 0 auto;
}
.resultimg{
	border-radius: 25px;
	width: 50%;
}
.floatright{
	float: right;
	padding-right: 1%;
}
.grid{
	display: grid;
	align-items: center;
	grid-template-rows: 1fr 3fr 1fr;
}
</style>
