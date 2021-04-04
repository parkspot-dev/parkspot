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
			var lat = this.getLat() //12.8576 
			var lng = this.getLng() //77.7864
			var center;
			var mapLoadedTimer;
			if(lat === null || lng === null){
				console.log("reverting to default lat long")
				center = [77.7864,12.8576] //fallout lat long
			}
			else{
				center = [Number(lng), Number(lat)]
			}
			var map;
			mapboxgl.accessToken = 'pk.eyJ1IjoiYmZyaWVkbHkiLCJhIjoiY2p4bHd1OXdpMGFycDN0bzFiNWR4d2VyNyJ9.3hQjvgyoPoCuRx-Hqr_BFQ';
			var flavour = "dweb"
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				flavour = "mweb"
			}
			console.log(flavor)
			fetch(`https://maya.parkspot.in/search?lat=${center[1]}&long=${center[0]}&start=20201115t1250&end=20201115t1400`, {
		    	method: 'GET', // *GET, POST, PUT, DELETE, etc.
			})
			.then((resp)=>{
				return resp.json()
			})
			.then((sites)=>{
				var arr = []
				sites = sites["Sites"]
				var markers = []
				for(var i=0;i<sites.length;i++){
					var temp = {}
					temp["name"] = sites[i]["Name"]
					temp["address"] = sites[i]["Address"]
					temp["latLng"] = [Number(sites[i].Lat), Number(sites[i].Long)]
					try{
						markers.push([Number(sites[i].Long), Number(sites[i].Lat)])
						//new mapboxgl.Marker().setLngLat([Number(sites[i].Long), Number(sites[i].Lat)]).addTo(map)
					}
					catch(e){
						console.log(sites[i].Lat, sites[i].Lng)
						console.log(e)
					}
					temp["rate"] = sites[i]["Fee"]["BaseAmount"]
					temp["unit"] = sites[i]["RentUnit"]
					temp["type"] = "private parking"
					temp["imageURI"] = sites[i]["IconURL"] 
					temp["amount"] = sites[i]["Fee"]["Amount"]
					temp["slotsAvailable"] = sites[i]["SlotsAvailable"]
					temp["totalSlots"] = sites[i]["TotalSlots"]
					temp["vehicleType"] = sites[i]["VehicleType"]
					temp["cropImage"] = sites[i]["IconURL"] === "https://parkspot.blob.core.windows.net/assets/default.png"
					temp["distance"] = sites[i]["Distance"]
					temp["rating"] = sites[i]["Rating"]
					arr.push(temp)
				}
				var centroid = this.calculateCentroid(arr)
				console.log("centurion", centroid)
				repaint(centroid, flavour)
				for(var i of markers){
					new mapboxgl.Marker({color: "#2F4F4F"}).setLngLat(i).addTo(map)
				}
				new mapboxgl.Marker({color: "#000"}).setLngLat(i).addTo(map)
				this.$root.$emit("sitesReady", arr)
			})
			.catch((err)=>{
				this.$root.$emit("sitesReady", [])
			})
			function repaint(pos, flavour){
				console.log("hale", pos)
				map = new mapboxgl.Map({
				container: 'map', // container id
				style: 'mapbox://styles/mapbox/dark-v10', // style URL
				center: pos, // starting position [lng, lat]
				zoom: 11 // starting zoom
				});
				if(flavour === "mweb"){
					map.scrollZoom.disable();
				}
                map.addControl(new mapboxgl.NavigationControl());

			}

			if(lat === null || lng === null){
				navigator.geolocation.getCurrentPosition(function(res){
						//var current = [77.7864, 12.8576]
						var current = [res.coords.longitude, res.coords.latitude]
						console.log("current lat long",current)
						repaint(current, flavour)
				})
			}
			var map;
			repaint(center, flavour)

	},
	methods: {
		calculateCentroid: function(arr){
			console.log(arr)
			var xs = arr.reduce((a,e)=>{
				const cord = e["latLng"][0]
				return a + cord
			}
			,0)
			var ys = arr.reduce((a,e)=>{
				const cord = e["latLng"][1]
				return a + cord
			}
			,0)
			return [ys/arr.length, xs/arr.length]
		},
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
