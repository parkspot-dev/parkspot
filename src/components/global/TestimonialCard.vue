<template>
    <div class="testimonial-card">
        <div class="author-info">
            <img class="author-image" :alt="item.name" :src="item.image" />
            <div>
                <h4 class="author-name">{{ item.name }}</h4>
                <p class="author-details">{{ item.date }}</p>
            </div>
        </div>
        <div class="divider-line"></div>
        <p class="testimonial-text" v-html="formattedQuote" ></p>
    </div>
</template>

<script>
export default {
    name: 'TestimonialCard',
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
    computed: {
        // Formats the quote to replace newline characters with <br> tags.
        formattedQuote() {
            return this.item.quote.replace(/\n/g, '<br>');
        },
    },
};
</script>

<style scoped>
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
    flex-direction: column;
    gap: 1rem;
    margin: 20px;
    min-height: 240px;
    padding: 16px;

    .divider-line {
        background-color: var(--primary-color);
        height: 1px;
        width: 100%;
    }
}

.testimonial-text {
    color: var(--parkspot-black);
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 16px;
}
</style>

