<template>
	<div class="customherocontainer">
		<div class="customhero">
			<div id="map">
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		name: "SRP",
		mounted: function(){
			var lat = this.getLat()
			var lng = this.getLng()
			var center;
			var mapLoadedTimer;
			if(lat === null || lng === null){
				center = [77.8782,12.9098] //fallout lat long
			}
			else{
				center = [lng, lat]
			}
			var map;
			mapboxgl.accessToken = 'pk.eyJ1IjoiYmZyaWVkbHkiLCJhIjoiY2p4bHd1OXdpMGFycDN0bzFiNWR4d2VyNyJ9.3hQjvgyoPoCuRx-Hqr_BFQ';
			
			function repaint(pos){
				console.log("hale", pos)
				map = new mapboxgl.Map({
				container: 'map', // container id
				style: 'mapbox://styles/mapbox/dark-v10', // style URL
				center: pos, // starting position [lng, lat]
				zoom: 13 // starting zoom
				});
				mapLoadedTimer = setInterval(function(timer, map){
						if(map.loaded()){
							var elem = document.getElementById("welcomeText")
							if(elem !== null){
								elem.classList.remove("has-text-dark")
								elem.classList.add("has-text-light")
							}
						}
						clearInterval(timer)
				}, 100, mapLoadedTimer, map)
				map.scrollZoom.disable();
				var nmarkers = 10;
				var markers = []
				for(var i=0;i<nmarkers;i++){
					var tpos = [...pos]
					var min = 0.01
					var max = 0.2
					tpos[-1] = tpos[0] + (Math.random() * (max - min) + min)
					tpos[1] = tpos[1] + (Math.random() * (max - min) + min)
					console.log(tpos)
					var marker = new mapboxgl.Marker().setLngLat(tpos).addTo(map)
				}

			}
			
			if(lat === null || lng === null){
				navigator.geolocation.getCurrentPosition(function(res){
						//var current = [77.7053, 12.9504]
						var current = [res.coords.longitude, res.coords.latitude]
						console.log(current)
						repaint(current)
				})
			}
			var map;
			repaint(center)

	},
	methods: {
		getLat: function(){
			var queryParam = new URLSearchParams(window.location.search)
			return queryParam.get("lat")
		},
		getLng: function(){
			var queryParam = new URLSearchParams(window.location.search)
			return queryParam.get("lng")
		},
	}

	}
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
		z-index: -1;
	}
	#map:focus{
  		-webkit-filter: blur(0.5px);
  		-moz-filter: blur(0.5px);
  		-o-filter: blur(0.5px);
  		-ms-filter: blur(0.5px);
  		filter: blur(0.5px); 
	}
	/*
	.marker {
  		background-image: url('https://developers.google.com/maps/images/maps-icon.svg');
  		background-size: cover;
  		width: 50px;
  		height: 50px;
  		border-radius: 50%;
  		cursor: pointer;
	}
	*/
</style>
