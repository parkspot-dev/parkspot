<template lang="pug">
	.customherocontainer
		.customhero
			.searchbar
				p.is-size-1.has-text-dark#welcomeText
					| Search a parking spot near you !
				br
				input.input.is-primary(v-on:onkeydown="entered($event)")
			#map
</template>

<script>

	
	window.onload = function(){
			var mapLoadedTimer;
			var center = [77.8782,12.9098] //fallout lat long
			var map;
			mapboxgl.accessToken = 'pk.eyJ1IjoiYmZyaWVkbHkiLCJhIjoiY2p4bHd1OXdpMGFycDN0bzFiNWR4d2VyNyJ9.3hQjvgyoPoCuRx-Hqr_BFQ';
			

			function repaint(pos){
				map = new mapboxgl.Map({
				container: 'map', // container id
				style: 'mapbox://styles/mapbox/dark-v10', // style URL
				center: pos, // starting position [lng, lat]
				zoom: 17 // starting zoom
				});
				mapLoadedTimer = setInterval(function(timer, map){
						if(map.loaded()){
							var elem = document.getElementById("welcomeText")
							elem.classList.remove("has-text-dark")
							elem.classList.add("has-text-light")
							clearInterval(timer)
						}
				}, 100, mapLoadedTimer, map)
				map.scrollZoom.disable();
			}
			

			navigator.geolocation.getCurrentPosition(function(res){
					//var current = [77.7053, 12.9504]
					var current = [res.coords.longitude, res.coords.latitude]
					console.log(current)
					repaint(current)
			})
			var map;
			repaint(center)

	}
	export default {
	  name: "PSMap",
	  methods: {
	  	entered: function mapboxSearchEnter(capEvent){
			if(capEvent.key === "Enter"){
				console.log("Entered")
			}
		}
	  }
	};
</script>

<style scoped>
	.customherocontainer{
		top: 0;
		position: relative;
	}
	.customhero{
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0;
		padding: 0;
		height: 100vh;
		width: 100%;
	}
	.searchbar{
		width: 60%;
		z-index: 1	
	}
	#map {
		margin: 0;
		padding: 0;
		position: absolute; 
		top: 0; 
		bottom: 0; 
		width: 100%; 
		height: 100%;
		z-index: 0;
	}
	#map:focus{
  		-webkit-filter: blur(0.5px);
  		-moz-filter: blur(0.5px);
  		-o-filter: blur(0.5px);
  		-ms-filter: blur(0.5px);
  		filter: blur(0.5px); 
	}
</style>

