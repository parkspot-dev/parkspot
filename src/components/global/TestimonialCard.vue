<template>
    <div class="testimonial-card">
        <div class="author-info">
            <img class="author-image" :alt="item.name" :src="item.image" />
            <div>
                <h4 class="author-name">{{ item.name }}</h4>
                <AtomRating
                    :rate="item.rate"
                    :size="'is-small'"
                    class="rating"
                />
            </div>
        </div>
        <div class="divider-line"></div>
        <p class="testimonial-text">{{ formattedQuote }}</p>
        <a
            v-if="item.link"
            :href="item.link"
            class="read-more-link"
            target="_blank"
        >
            <img alt="Google Icon" class="google-icon" :src="googleIcon" />
            <span>View review</span>
        </a>
        <div
            v-if="item.role"
            class="read-more-link"
        >
            {{ item.role }}
        </div>
    </div>
</template>

<script>
import AtomRating from '../atoms/AtomRating.vue';

export default {
    name: 'TestimonialCard',
    components: {
        AtomRating,
    },
    props: {
        /**
         * The item prop should be an object with the following structure:
         * {
         *   date: String,      // The display date for the testimonial (e.g., '6 Nov 2023')
         *   datetime: String,  // ISO format or additional datetime info (e.g., '2020-7-29')
         *   image: String,     // URL or path to the image of the person
         *   name: String,      // Name of the person giving the testimonial
         *   quote: String,     // The testimonial text
         *   rate: Number,      // Rating given by the person (e.g., 4.9)
         * }
         */
        item: {
            required: true,
            type: Object,
        },
    },
    data() {
        return {
            googleIcon: 'https://cdn-icons-png.flaticon.com/128/300/300221.png',
        };
    },
    computed: {
        // Formats the quote to replace newline characters with <br> tags.
        formattedQuote() {
            return this.item.quote.replace(/\n/g, '<br>');
        },
    },
};
</script>

<style lang="scss" scoped>
.author-details {
    color: var(--parkspot-muted-black);
    font-size: 14px;
    margin: 0;
}

.author-image {
    border: 1px solid var(--grey-shade);
    border-radius: 50%;
    height: 50px;
    object-fit: cover;
    width: 50px;
}

.author-info {
    align-items: center;
    display: flex;
    gap: 12px;
    margin-top: 1rem;
    padding-top: 16px;
}

.author-name {
    color: var(--parkspot-black);
    font-size: 16px;
    font-weight: bold;
    margin: 0;
}

.testimonial-card {
    background-color: var(--parkspot-white);
    border-radius: 8px;
    border: 1px solid var(--parkspot-white);
    box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 1rem;
    margin: 20px;
    min-height: 280px;
    padding: 16px;

    .divider-line {
        background-color: var(--primary-color);
        height: 1px;
        width: 100%;
    }
}

.testimonial-text {
    color: var(--parkspot-black);
    flex-grow: 1;
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 16px;
}

.google-icon {
    height: 1.15rem;
    transition:
        transform 0.1s ease,
        opacity 0.1s ease,
        filter 0.1s ease;
}
.read-more-link {
    align-items: center;
    align-self: flex-end;
    color: var(--secondary-color);
    display: flex;
    gap: 0.4rem;
    margin-top: 5%;
    text-decoration: none;
}
.read-more-link:hover {
    font-weight: 500;
}
.read-more-link:hover .google-icon {
    filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1));
    transform: scale(1.1);
}
</style>
