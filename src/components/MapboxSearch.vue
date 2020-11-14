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
					console.log(current)
					repaint(current)
			})
			var map;
			repaint(center)

		},
        methods: {
            // You have to install and import debounce to use it,
            // it's not mandatory though.
            getAsyncData: debounce(function (name) {
                if (!name.length) {
                    this.data = []
                    return
                }
                this.isFetching = true
					fetch(`http://api.mapbox.com/geocoding/v5/mapbox.places/${name}.json?access_token=pk.eyJ1IjoiaWFtZmlhc2NvIiwiYSI6ImNrOWZiankzdjA5d2kzbWp3NGNzNmIwaHAifQ.E2UwYdvpjc6yNoCmBjfTaQ&proximity=77.4977,12.9716`) //TODO: remove lat long hardcode
				.then(e => e.json())
				.then((data)=>{
					try{
						this.data = data.features.map(e => e.place_name)
						console.log(this.data)
					}
					catch(e){
						this.data = []
						console.log("errm")
						//data.features.forEach((item) => this.data.p)
					}
				})
                //fetch(`https://api.themoviedb.org/3/search/movie?api_key=bb6f51bef07465653c3e553d6ab161a8&query=${name}`)
				//	.then(e=>e.json())
                //    .then((data) => {
                //        console.log(data)
				//		this.data = []
                //        data.results.forEach((item) => this.data.push(item))
                //    })
                //    .catch((error) => {
                //        this.data = []
                //        throw error
                //    })
                //    .finally(() => {
                //        this.isFetching = false
                //    })
            }, 500)
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
