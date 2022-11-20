<template>
    <div class="gallery-container">
        <div id="lightgallery">
            <!-- <template v-for="i in 5">
                <a
                    :key="i"
                    class="gallery-item"
                    href="http://localhost:8080/img/Home-Banner.b9fc5fdb.jpg"
                    :data-sub-html="`<h4>Photo by - <a href='https://www.parkspot.in' >Parkspot </a></h4><p> Location - ${temp}</p>`"
                >
                    <img
                        class="img-responsive"
                        src="../../assets/Home-Banner.jpg"
                    />
                </a>
            </template> -->
            <a
                class="gallery-item"
                :href="spotImage"
                :data-sub-html="`<h4>Photo by - <a href='https://www.parkspot.in' >Parkspot </a></h4><p> Location - ${temp}</p>`"
            >
                <img class="img-responsive" :src="spotImage" />
            </a>

            <a
                class="gallery-item"
                data-src="https://images.unsplash.com/photo-1544550285-f813152fb2fd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80"
                :data-sub-html="`<h4>Photo by - <a href='https://www.parkspot.in' >Parkspot </a></h4><p> Location - ${temp}</p>`"
            >
                <img class="img-responsive" src="../../assets/no-image.png" />
            </a>
            <a
                class="gallery-item"
                data-src="https://images.unsplash.com/photo-1544550285-f813152fb2fd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80"
                :data-sub-html="`<h4>Photo by - <a href='https://www.parkspot.in' >Parkspot </a></h4><p> Location - ${temp}</p>`"
            >
                <img class="img-responsive" src="../../assets/no-image.png" />
            </a>
            <a
                class="gallery-item"
                data-src="https://images.unsplash.com/photo-1544550285-f813152fb2fd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80"
                :data-sub-html="`<h4>Photo by - <a href='https://www.parkspot.in' >Parkspot </a></h4><p> Location - ${temp}</p>`"
            >
                <img class="img-responsive" src="../../assets/no-image.png" />
            </a>
            <a
                class="gallery-item"
                data-src="https://images.unsplash.com/photo-1544550285-f813152fb2fd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80"
                :data-sub-html="`<h4>Photo by - <a href='https://www.parkspot.in' >Parkspot </a></h4><p> Location - ${temp}</p>`"
            >
                <img class="img-responsive" src="../../assets/no-image.png" />
            </a>
        </div>
    </div>
</template>

  <script>
import 'lightgallery.js';
import 'lightgallery.js/dist/css/lightgallery.css';
import { mapState } from 'vuex';

export default {
    name: 'ImageGallery',
    data() {
        return {
            imageList: [],
            temp: 'N/A',
        };
    },
    computed: {
        ...mapState('sdp', {
            spotImage: (state) => state.image,
        }),
    },
    mounted() {
        const el = document.getElementById('lightgallery');
        window.lightGallery(el, {
            thumbnail: true,
        });
    },
};
</script>

<style lang="scss" scoped >
.gallery-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    // background-color: red;

    .gallery-item {
        position: absolute;
        opacity: 1;
        border: 1px solid black;

        &:nth-child(1) {
            width: 660px;
            height: 400px;
            top: 0;
            left: 0;
        }

        &:nth-child(2) {
            width: 330px;
            height: 195px;
            top: 0;
            left: 675px;
        }

        &:nth-child(3) {
            width: 330px;
            height: 195px;
            top: 205px;
            left: 675px;
        }

        &:nth-child(4) {
            width: 330px;
            height: 195px;
            top: 0;
            left: 1013px;
        }

        &:nth-child(5) {
            width: 330px;
            height: 195px;
            top: 205px;
            left: 1013px;
        }

        .img-responsive {
            height: 100%;
            width: 100%;
        }
    }
}
</style>