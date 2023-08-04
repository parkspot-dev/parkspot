<template>
    <div class="blog-card">
        <div class="img-wrapper blog-image">
            <AtomImage
                :alt="'image'"
                :src="blog.img"
                :ratio="'5by4'"
                class="image-container"
            ></AtomImage>
        </div>
        <div class="blog-content">
            <div class="blog-title">
                <h2 :variation="'large'">
                    {{ blog.title }}
                </h2>
                <p>by {{ blog.author }}</p>
            </div>

            <div class="blog-desc">
                <p>{{ blog.desc }}</p>
                <time :datetime="blog.dateTime">{{ blog.time }} </time>
                <span>
                    <button 
                        class="btn-text" 
                        @click="onBlogClick(blog.id)">Read more...
                    </button>
                </span>           
            </div>
        </div>
    </div>
</template>

<script>
import AtomImage from '../atoms/AtomImage.vue';
export default {
    name: 'MoleculeBlogCard',
    props: {
        blog: {
            type: Object,
        },
    },
    components: {
        AtomImage,
    },
    emits:['onBtnClick'],
    methods: {
        onBlogClick(data) {
            console.log("Data",data);
            this.$emit('onBtnClick', data);
        },
    },
};
</script>

<style lang="scss" scoped>
.blog-card {
    min-width: 374px;
    min-height: 379px;
    border-radius: var(--border-default);
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
        rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;

    @media only screen and (max-width: 1024px) {
        width: 374px;
        min-width: 350px;
    }

    .blog-image {
        cursor: pointer;
        opacity: 1;
        transition: 0.3s ease-in-out;
        height: 189px;
        overflow: hidden;
        border-top-left-radius: var(--border-default);
        border-top-right-radius: var(--border-default);

        &:hover {
            opacity: 0.5;
        }

        .image-container {
            padding-top: 50%;
        }
    }

    .blog-content {
        padding: 0.75rem;
        .blog-image:hover {
            opacity: 0.5;
        }

        .blog-title {
            margin-bottom: 1rem;

            &:hover {
                color: var(--secondary-color) !important;
            }

            h2 {
                font: 1.25rem;
                font-weight: 500;
            }

            p {
                font: 1rem;
                font-weight: 400;
            }
        }

        .blog-desc {
            font-weight: 400;
            font-size: 1rem;
            line-height: 24px;
            color: var(--grey-shade);

            time {
                font-size: 0.75rem;
            }
        }
    }
}

.blog-card {
    .img-wrapper.blog-image {
        border-top-left-radius: 45px;
        border-top-right-radius: 45px;
        border-bottom-left-radius: 25px;
        border-bottom-right-radius: 25px;
        padding: 12px;        
    }
}

.blog-card .blog-content .blog-desc .btn-text {
    float: right; 
    font-family: 'Poppins', sans-serif;
    color: var(--primary-text);
    border-radius: 50px;
    border-style: none;
    padding: 4px 10px;
    cursor: pointer;

    &:hover {
                color: var(--secondary-color) ;
            }
}
</style>