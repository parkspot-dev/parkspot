<template lang="pug">
    div(class="hero is-warning is-fullheight" id="PSOffering")
        div(class="hero-head")
            .hero-body
                .columns.is-vcentered.is-mobile.is-centered
                    .column
                        p.title Our Offerings
                    .column
                        .card.team
                            .card-title
                                b.has-text-black ParkSpot for Corporates
                            .card-image
                                figure.image.is-4by3
                                    img(:src="`${corporate}`")
                            .card-content
                                .content.is-left-align
                                    |Give your employees the gift of easy parking.
                            .card-footer.is-pad
                                .container
                                    a(class="button is-black" href='/#contact') Get in touch
                    .column
                        .card.team
                            .card-title
                                b.has-text-black ParkSpot for Societies
                            .card-image
                                figure.image.is-4by3
                                    img(:src="`${society}`")
                            .card-content
                                .content.is-left-align
                                    |Secure your society and enable seamless entry/exit for residents.
                            .card-footer.is-pad
                                .container
                                    a(class="button is-black" href='/#contact') Get in touch
                    .column
                        .card.team
                            .card-title
                                b.has-text-black ParkSpot for Parking Owners
                            .card-image
                                figure.image.is-4by3
                                    img(:src="`${owner}`")
                            .card-content
                                .content.is-left-align
                                    |Want to monetize your idle parking spaces?
                            .card-footer.is-pad
                                .container
                                    a(class="button is-black" href='/#contact') Get in touch
                    .column
                        .card.team
                            .card-title
                                b.has-text-black ParkSpot for Malls/Hotels
                            .card-image
                                figure.image.is-4by3
                                    img(:src="`${corporate}`")
                            .card-content
                                .content.is-left-align
                                    |Digitized parking space for better monetization and a seamless customer experience.
                            .card-footer.is-pad
                                .container
                                    a(class="button is-black" href='/#contact') Get in touch

    
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
.is-left-align{
    text-align: left;
}
.is-pad{
    padding-bottom: 10px;
}
.card-title{
    padding: 10px 5px 5px 5px;
}
</style>