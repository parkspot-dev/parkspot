<template lang="pug">
    div(class="hero is-warning is-fullheight" id="PSOffering")
        div(class="hero-head")
            .hero-body
                .columns.is-vcentered.is-mobile.is-centered
                    .column
                        p.title Our Offerings
                    .column
                        .card.team
                            .card-image
                                figure.image.is-4by3
                                    img(:src="`${corporate}`")
                            .card-content
                                .content
                                    b.has-text-black ParkSpot for Corporates
                                    |
                                    |Give your employees the gift of easy parking.
                            .card-footer
                                .container
                                    a(class="button is-black" href='#') Get in touch
                    .column
                        .card.team
                            .card-image
                                figure.image.is-4by3
                                    img(:src="`${society}`")
                            .card-content
                                .content
                                    b.has-text-black ParkSpot for Societies
                                    |
                                    |Secure your society and enable seamless entry/exit for residents.
                            .card-footer
                                .container
                                    a(class="button is-black" href='#') Get in touch
                    .column
                        .card.team
                            .card-image
                                figure.image.is-4by3
                                    img(:src="`${owner}`")
                            .card-content
                                .content
                                    b.has-text-black ParkSpot for Parking Owners
                                    |
                                    |Want to monetize your idle parking spaces?
                            .card-footer
                                .container
                                    a(class="button is-black" href='#') Get in touch
                    .column
                        .card.team
                            .card-image
                                figure.image.is-4by3
                                    img(:src="`${corporate}`")
                            .card-content
                                .content
                                    b.has-text-black ParkSpot for Malls/Hotels
                                    |
                                    |Digitized parking space for better monetization and a seamless customer experience.
                            .card-footer
                                .container
                                    a(class="button is-black" href='#') Get in touch

    
</template>

<script lang="ts">

export default ({
    name: 'PSOffering',
    data(){
        return{
               corporate: require('@/assets/offering/corporates.png'),
               hotel: require('@/assets/offering/hotels.png'),
               society: require('@/assets/offering/society.png'),
               owner: require('@/assets/offering/owner.png')
        }
    }
})
</script>

<style scoped>

</style>