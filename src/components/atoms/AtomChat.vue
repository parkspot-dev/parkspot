<template>
    <div class="chat">
        <a
            href="https://wa.me/917488239471?text=I'm%20interested%20in%20car%20parking."
            target="_blank"
        >
            <AtomImage
                src="assets/wa-icon.png"
                alt="chat-icon"
                class="chat-icon"
            />
        </a>
    </div>
</template>

<script>
import AtomImage from './AtomImage.vue';
export default {
    name: 'AtomChat',
    components: { AtomImage },
};
</script>

<style>
.chat {
    height: 64px;
    width: 64px;
    position: fixed;
    right: 20px;
    bottom: 20px;
}
.chat-icon {
    transition: transform 0.2s; /* Animation */
}
.chat-icon:hover {
    transform: scale(1.2); /* (120% zoom ) */
}
</style>
