<template>
	<div class="customherocontainer">
		<div class="customhero">
			<div class="searchbar">
      			<p class="is-size-1 has-text-dark" id="welcomeText"> Search a parking spot near you ! </p>
    			<section>
    			        <b-autocomplete
    			            :data="data"
    			            placeholder="e.g. Bangalore"
    			            field="title"
    			            :loading="isFetching"
    			            @typing="getAsyncData"
    			            @select="option => selected = option">
    			            <template slot-scope="props">
    			                    <div class="media-content">
    			                        {{ props.option }}
    			                    </div>
    			            </template>
    			        </b-autocomplete>
    			</section>
				<br>
				<button class="button is-warning" type="submit" v-on:click="flyToSrp()"> Go !</button>
			</div>
			<div id="maph" v-if="mapdisp">
			</div>
		</div>
	</div>
</template>

<script>
    import debounce from 'lodash/debounce'
	export default {
		name: 'PSMap',
        data() {
            return {
                data: [],
                selected: null,
                isFetching: false,
				mapdisp: true,
            }
        },
		mounted: function(){

			var mapLoadedTimer;
			var center = [77.8782,12.9098] //fallout lat long
			var map;
			mapboxgl.accessToken = 'pk.eyJ1IjoiYmZyaWVkbHkiLCJhIjoiY2p4bHd1OXdpMGFycDN0bzFiNWR4d2VyNyJ9.3hQjvgyoPoCuRx-Hqr_BFQ';
			

			function repaint(pos){
				map = new mapboxgl.Map({
				container: 'maph', // container id
				style: 'mapbox://styles/mapbox/dark-v10', // style URL
				center: pos, // starting position [lng, lat]
				zoom: 13 // starting zoom
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
					repaint(current)
			})
			var map;
			repaint(center)

		},
        methods: {
			/*
				autosuggestions pulling data from remote source via API when reactive with respect to DOM
				can make lot of network calls; inorder to disallow this we wait for 500ms of delay then and 
				only then we make a call

				for more info ``https://css-tricks.com/debouncing-throttling-explained-examples/#debounce-examples
			*/
            getAsyncData: debounce(function (name) {
                if (!name.length) {
                    this.data = []
                    return
                }
                this.isFetching = true
					fetch(`http://api.mapbox.com/geocoding/v5/mapbox.places/${name}.json?access_token=pk.eyJ1IjoiaWFtZmlhc2NvIiwiYSI6ImNrOWZiankzdjA5d2kzbWp3NGNzNmIwaHAifQ.E2UwYdvpjc6yNoCmBjfTaQ&proximity=77.4977,12.9716`) 
				//TODO: remove lat long hardcode
				.then(e => e.json())
				.then((data)=>{
					try{
						this.data = data.features.map(e => e.place_name)
					}
					catch(e){
						this.data = []
						//data.features.forEach((item) => this.data.p)
					}
				})
            }, 500),
			flyToSrp: function(){
				this.$router.push({name: "PSSrp", query: {"search_loc": this.selected}})
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
	#maph {
		margin: 0;
		padding: 0;
		position: absolute; 
		top: 0; 
		bottom: 0; 
		width: 100%; 
		height: 100%;
		z-index: -1;
	}
	#maph:focus{
  		-webkit-filter: blur(0.5px);
  		-moz-filter: blur(0.5px);
  		-o-filter: blur(0.5px);
  		-ms-filter: blur(0.5px);
  		filter: blur(0.5px); 
	}
</style>
