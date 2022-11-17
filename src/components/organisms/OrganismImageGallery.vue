<template>
    <div class="gallery-container">
        <div id="lightgallery">
            <a
                class="gallery-item"
                href="http://localhost:8080/img/Home-Banner.b9fc5fdb.jpg"
            >
                <img
                    class="img-responsive"
                    src="../../assets/Home-Banner.jpg"
                />
            </a>
            <a
                class="gallery-item"
                data-src="https://images.unsplash.com/photo-1544550285-f813152fb2fd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80"
                data-sub-html="<h4>Photo by - <a href='https://unsplash.com/@asoshiation' >Shah </a></h4><p> Location - <a href='https://unsplash.com/s/photos/shinimamiya%2C-osaka%2C-japan'>Shinimamiya, Osaka, Japan</a></p>"
            >
                <img
                    class="img-responsive"
                    src="https://images.unsplash.com/photo-1544550285-f813152fb2fd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80"
                />
            </a>
            <a
                class="gallery-item"
                data-src="https://images.unsplash.com/photo-1584592740039-cddf0671f3d4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80"
                data-sub-html="<h4>Photo by - <a href='https://unsplash.com/@katherine_xx11' >Katherine Gu </a></h4><p> For all those years we were alone and helpless.</p>"
            >
                <img
                    class="img-responsive"
                    src="https://images.unsplash.com/photo-1584592740039-cddf0671f3d4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80"
                />
            </a>
            <a
                class="gallery-item"
                data-src="https://images.unsplash.com/photo-1584592740039-cddf0671f3d4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80"
                data-sub-html="<h4>Photo by - <a href='https://unsplash.com/@katherine_xx11' >Katherine Gu </a></h4><p> For all those years we were alone and helpless.</p>"
            >
                <img
                    class="img-responsive"
                    src="https://images.unsplash.com/photo-1584592740039-cddf0671f3d4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80"
                />
            </a>
            <a
                class="gallery-item"
                data-src="https://images.unsplash.com/photo-1584592740039-cddf0671f3d4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80"
                data-sub-html="<h4>Photo by - <a href='https://unsplash.com/@katherine_xx11' >Katherine Gu </a></h4><p> For all those years we were alone and helpless.</p>"
            >
                <img
                    class="img-responsive"
                    src="https://images.unsplash.com/photo-1584592740039-cddf0671f3d4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80"
                />
            </a>
        </div>
    </div>
</template>

  <script>
import 'lightgallery.js';
import 'lightgallery.js/dist/css/lightgallery.css';

export default {
    name: 'ImageGallery',
    data() {
        return {
            imageList: [],
        };
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