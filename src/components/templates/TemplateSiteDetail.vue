<template>
    <BodyWrapper>
        <!-- collage for image gallery Organism-->
        <!-- Rate Card Organism -->
        <div class="site-detail-main-description">
            <h1>Spot Name</h1>
            <p>Address of the Spot in Banglore, Pin 876543, Karnataka, India</p>
        </div>

        <div class="site-detail-amenities">
            <h2>What this place offers</h2>
            <ul>
                <li>Covered</li>
                <li>Gated</li>
                <li>CCTV</li>
                <li>Security Gaurd</li>
            </ul>
        </div>

        <div class="site-detail-map">
            <h2>How to get here?</h2>
        </div>

        <div class="site-detail-things">
            <!-- Organism to show the graphical layout -->
        </div>

        <!-- only to admin -->
        <div class="site-detail-owner"></div>
    </BodyWrapper>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
export default {
    name: 'TemplateSiteDetail',
    components: {
        BodyWrapper,
    },
};
</script>