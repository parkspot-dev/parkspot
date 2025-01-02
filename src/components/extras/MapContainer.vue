<template>
    <div id="map" style="min-height: 450px"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import { mapGetters, mapMutations } from 'vuex';
import { getValueFromFirebase } from '../../firebase';
export default {
    name: 'MapContainer',
    props: {
        /**
         * map drag option for form only
         */
        drag: {
            type: Boolean,
            default: false,
        },
        spotsList: {
            type: Array,
        },
    },
    emits: ['location'],
    data() {
        return {
            accessToken: null,
            img: require('@/assets/pstopmini.png'),
            map: null, // map for mapbox
            marker: null, // marker for location
        };
    },
    computed: {
        ...mapGetters({
            mapConfig: 'map/getMapConfig',
            mapCenter: 'map/getNewMapCenter',
        }),
    },
    watch: {
        mapCenter(newCenter) {
            this.recenterMap(newCenter);
        },
    },

    mounted() {
        this.getMapAccessToken().then(() => this.renderMap());
    },

    methods: {
        ...mapMutations({
            updateMapConfig: 'map/update-map-config',
        }),
        recenterMap(center) {
            if (!this.map) {
                return;
            }

            this.map.flyTo({
                center: center,
            });
            this.marker.setLngLat(center);
        },
        renderMap() {
            if (this.accessToken) {
                mapboxgl.accessToken = this.accessToken;

                // Create map
                this.map = new mapboxgl.Map(this.mapConfig);

                // Create popup
                const popup = new mapboxgl.Popup({ offset: 25 }).setText(
                    'Your current location.',
                );

                // Create marker
                this.marker = new mapboxgl.Marker({
                    draggable: this.drag,
                })
                    .setLngLat(this.mapConfig.center)
                    .setPopup(popup)
                    .addTo(this.map);

                if (this.drag) {
                    this.map.on('click', (e) => {
                        this.marker
                            .setPopup(popup)
                            .setLngLat(e.lngLat)
                            .addTo(this.map);
                        this.updateMapConfig(this.marker.getLngLat());
                        this.$emit('location', this.marker.getLngLat());
                    });

                    this.marker.on('dragend', () => {
                        this.updateMapConfig(this.marker.getLngLat());
                        this.$emit('location', this.marker.getLngLat());
                    });
                }

                // Add parking site markers
                for (const spot of this.spotsList) {
                    const encodedSpotId = encodeURIComponent(spot.ID);
                    const psMarker = document.createElement('div');

                    psMarker.className = 'marker';
                    psMarker.style.backgroundImage = 'url(' + this.img + ')';
                    psMarker.style.width = '50px';
                    psMarker.style.height = '50px';
                    psMarker.style.backgroundSize = '110%';

                    const psPopup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                        `
        <style>
            .name {
                font-weight: bold;
                font-size: 1rem;
            }

            .address {
                font-size: 0.75rem;
            }

            .btn-container {
                align-content: space-around;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                margin-top: 1rem;

            }

            .btn {
                align-items: center;
                background-color: #ffe08a;
                border-radius: 8px;
                border-color: #dbdbdb;
                border-width: 2px;
                cursor: pointer;
                font-size: .75rem;
                font-weight: 700;
                justify-content: center;
                margin:4px;
                padding-bottom: calc(.5em - 1px);
                padding-left: 1em;
                padding-right: 1em;
                padding-top: calc(.5em - 1px);
                text-align: center;
                white-space: nowrap;
            }
        </style>
        <div>
            <div class="name">${spot.Name}</div>
            <div class="address"> ${spot.Address}
                <div>India</div>
            </div>
        </div>
        <div style="margin-top:.5rem"><b>Distance: </b> ${spot.Distance} Km</div>
        <div><b>Rent: </b> &#8377; ${spot.Rate}/- </div>
        <div class="btn-container">
            <a href="https://www.google.com/maps/search/?api=1&query=${spot.Lat},${spot.Long}" target="_blank">
          <button class="btn">
             Navigate
          </button>
        </a>
            <a href="https://www.parkspot.in/spot-details/${encodedSpotId}" target="_blank">
          <button class="btn">
             View Spot
          </button>
        </a>
        </div>`,
                    );

                    new mapboxgl.Marker(psMarker)
                        .setLngLat([spot.Long, spot.Lat])
                        .setPopup(psPopup)
                        .addTo(this.map);
                }
            }
        },
        
        // Get map access token from cookies
        getMapAccessTokenFromCookie() {
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
                let [key, value] = cookie.split('=');
                key = key.trim();
                if (key === 'mapAccessToken') {
                    return value;
                }
            }
            return null;
        },

        // Set map access token in cookies
        setMapAccessTokenInCookies(mapAccessToken){
            const date = new Date();
            date.setTime(date.getTime() + 15 * 24 * 60 * 60 * 1000);
            const expires = `expires=${date.toUTCString()}`;
            document.cookie = `mapAccessToken=${mapAccessToken}; ${expires}; path=/`;
            this.accessToken = mapAccessToken;
        },

        async getMapAccessToken() {
            let mapAccessToken = this.getMapAccessTokenFromCookie();
            if (mapAccessToken) {
                // If map access token is present in cookie
                this.accessToken = mapAccessToken;
            } else {
                // If not present in cookie
                const keys = await getValueFromFirebase(
                    `/app-config/mapbox-access-data`,
                );

                // Check if we are getting keys from firebase
                if (keys && keys.length > 0) {
                    const randomIndex = Math.floor(Math.random() * keys.length);
                    const selectedKey = keys[randomIndex];
                    mapAccessToken = selectedKey.token;
                    setMapAccessTokenInCookies(mapAccessToken);
                } else {
                    console.error('Error while fetching map access token');
                }
            }
        },
    },
};
</script>

<style lang="scss" scoped>
/* stylelint-disable-next-line selector-max-id */
#map {
    width: 100%;
}
</style>
