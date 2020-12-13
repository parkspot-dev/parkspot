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
			var lat = 12.8576 //this.getLat()
			var lng = 77.7864 //this.getLng()
			var center;
			var mapLoadedTimer;
			if(lat === null || lng === null){
				center = [77.7864,12.8576] //fallout lat long
			}
			else{
				center = [Number(lng), Number(lat)]
			}
			var map;
			mapboxgl.accessToken = 'pk.eyJ1IjoiYmZyaWVkbHkiLCJhIjoiY2p4bHd1OXdpMGFycDN0bzFiNWR4d2VyNyJ9.3hQjvgyoPoCuRx-Hqr_BFQ';
			var check = false
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				check = true
			}
			var flavor = check ? "mweb" : "dweb"
			console.log(flavor)
			fetch("https://cors-anywhere.herokuapp.com/"+`http://168.63.243.20:5002/search?lat=12.8576&long=77.7864&start=20201115t1250&end=20201115t1400`, {
		    	method: 'GET', // *GET, POST, PUT, DELETE, etc.
		    	headers: {
    			  'Accept': '*/*',
		    	  'Content-Type': 'application/json',
				  'flavor': flavor 
		    	},
				})
				.then((resp)=>{
					const jsonResponse = resp.json().then((sites)=>{
					var arr = []
					sites = sites["Sites"]
					for(var i=0;i<sites.length;i++){
						var temp = {}
						temp["name"] = sites[i]["Name"]
						temp["location"] = ""
						temp["latLng"] = [Number(sites[i].Lat), Number(sites[i].Lng)]
						try{
							new mapboxgl.Marker().setLngLat([Number(sites[i].Long), Number(sites[i].Lat)]).addTo(map)
						}
						catch(e){
							console.log(sites[i].Lat, sites[i].Lng)
							console.log(e)
						}
						temp["rate"] = sites[i]["Fee"]["BaseAmount"]
						temp["unit"] = sites[i]["RentUnit"]
						temp["type"] = "private parking"
						temp["imageURI"] = sites[i]["IconURL"] 
						arr.push(temp)
					}
					this.$root.$emit("sitesReady", arr)
					})
				})
			function repaint(pos){
				console.log("hale", pos)
				map = new mapboxgl.Map({
				container: 'map', // container id
				style: 'mapbox://styles/mapbox/dark-v10', // style URL
				center: pos, // starting position [lng, lat]
				zoom: 10 // starting zoom
				});
				map.scrollZoom.disable();
				//var nmarkers = 10;
				//var markers = []
				//for(var i=0;i<nmarkers;i++){
				//	var tpos = [...pos]
				//	var min = 0.01
				//	var max = 0.2
				//	tpos[-1] = tpos[0] + (Math.random() * (max - min) + min)
				//	tpos[1] = tpos[1] + (Math.random() * (max - min) + min)
				//	console.log(tpos)
				//	var marker = new mapboxgl.Marker().setLngLat(tpos).addTo(map)
				//}

			}

			if(lat === null || lng === null){
				navigator.geolocation.getCurrentPosition(function(res){
						var current = [77.7864, 12.8576]
						//var current = [res.coords.longitude, res.coords.latitude]
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
			console.log(queryParam.get("lat"))
			return queryParam.get("lat")
		},
		getLng: function(){
			var queryParam = new URLSearchParams(window.location.search)
			console.log(queryParam.get("lng"))
			return queryParam.get("lng")
		}
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
