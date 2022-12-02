<template>
    <div :ref="sentinalName" class="w-full h-px relative"></div>
</template>
  
<script>
export default {
    name: 'IntersectionObserver',
    props: {
        sentinalName: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            isIntersectingElement: false,
        };
    },
    watch: {
        isIntersectingElement: function (value) {
            console.log(value);
            this.$emit('on-intersection-element', value);
        },
    },
    mounted() {
        const sentinal = this.$refs[this.sentinalName];

        const handler = (entries) => {
            if (entries[0].isIntersecting) {
                this.isIntersectingElement = true;
            } else {
                this.isIntersectingElement = false;
            }
        };

        const observer = new window.IntersectionObserver(handler);

        console.log('mounted', sentinal);
        observer.observe(sentinal);
    },
};
</script>

<style lang="scss" scoped>
.w-full {
    width: 100%;
}
.h-px {
    height: 1px;
}
.relative {
    position: relative;
}
</style>