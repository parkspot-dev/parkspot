<template lang="pug">
    div(class="hero is-warning is-fullheight" id="PSOffering")
        div(class="hero-head")
            .hero-body
                .columns.is-vcentered.is-centered
                    .column
                        p.title Our Offerings
                    .column.center.is-three-quarters-mobile
                        .card.team
                            .card-title.has-background-black
                                b.title.is-4.has-text-white ParkSpot for Corporates
                            .card-image.has-background-black.pb-3
                                figure.image.is-4by3.mx-5(v-lazyload)
                                    img(:data-url="corporate")
                            .card-content
                                .content.is-left-align
                                    |Give your employees the gift of easy parking.
                            .card-footer.is-pad
                                .container
                                    a(class="button is-dark" href='/#contact') Get in touch
                    .column.center.is-three-quarters-mobile
                        .card.team
                            .card-title.has-background-black
                                b.title.is-4.has-text-white ParkSpot for Societies
                            .card-image.has-background-black.pb-3
                                figure.image.is-4by3.mx-5(v-lazyload)
                                    img(:data-url="society")
                            .card-content
                               .content.is-left-align
                                    |Secure your society and enable seamless entry/exit for residents.
                            .card-footer.is-pad
                                .container
                                    a(class="button is-dark" href='/#contact') Get in touch
                    .column.center.is-three-quarters-mobile
                        .card.team
                            .card-title.has-background-black
                                b.title.is-4.has-text-white ParkSpot for Parking Owners
                            .card-image.has-background-black.pb-3
                                figure.image.is-4by3.mx-5(v-lazyload)
                                    img(:data-url="owner")
                            .card-content
                                .content.is-left-align
                                    |Want to monetize your idle parking spaces?
                            .card-footer.is-pad
                                .container
                                    a(class="button is-dark" href='/#contact') Get in touch
                    .column.center.is-three-quarters-mobile
                        .card.team
                            .card-title.has-background-black
                                b.title.is-4.has-text-white ParkSpot for Malls/Hotels
                            .card-image.has-background-black.pb-3
                                figure.image.is-4by3.mx-5(v-lazyload)
                                    img(:data-url="hotel")
                            .card-content
                                .content.is-left-align
                                    |Digitized parking space for better monetization and a seamless customer experience.
                            .card-footer.is-pad
                                .container
                                    a(class="button is-dark" href='/#contact') Get in touch

    
</template>

<script lang="ts">

export default ({
    name: 'PSOffering',
    data(){
        return{
               corporate: require('@/assets/offering/building.png'),
               hotel: require('@/assets/offering/hotel.png'),
               society: require('@/assets/offering/society.png'),
               owner: require('@/assets/offering/parking.png')
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
.bgblack{
    background-color: black;
}
.textwhite{
    color:white;
}
</style>