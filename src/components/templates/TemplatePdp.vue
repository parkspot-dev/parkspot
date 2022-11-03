<template>
    <BodyWrapper>
        <!-- collage for image gallery Organism-->
        <!-- Rate Card Organism -->
        <div class="pdp-main-description">
            <h1>Spot Name</h1>
            <p>Address of the Spot in Banglore, Pin 876543, Karnataka, India</p>
        </div>

        <div class="pdp-amenities">
            <h2>What this place offers</h2>
            <ul>
                <li>Covered</li>
                <li>Gated</li>
                <li>CCTV</li>
                <li>Security Gaurd</li>
            </ul>
        </div>

        <div class="pdp-map">
            <h2>How to get here?</h2>
        </div>

        <div class="pdp-things">
            <!-- Organism to show the graphical layout -->
        </div>

        <!-- only to admin -->
        <div class="pdp-owner"></div>
    </BodyWrapper>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
export default {
    name: 'TemplatePdp',
    components: {
        BodyWrapper,
    },
};
</script>