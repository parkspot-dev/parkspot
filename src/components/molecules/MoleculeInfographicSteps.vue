<template>
    <div class="infographic-container">
        <div class="infographic-bg-img"></div>
        <div class="infographic-first steps-container">
            <div class="step-img"></div>
            <img src="../../assets/first.png" alt="find" />
            <p>Find a listing you like on ParkSpot.</p>
        </div>
        <div class="infographic-second steps-container">
            <img src="../../assets/second.png" alt="find" />
            <p>Complete your registration.</p>
        </div>
        <div class="infographic-third steps-container">
            <img src="../../assets/third.png" alt="find" />
            <p>Visit the parking and verify the facts.</p>
        </div>
        <div class="infographic-fourth steps-container">
            <img src="../../assets/fourth.png" alt="find" />
            <p>
                If you like the parking, process the rent and security deposit.
            </p>
        </div>
        <div class="infographic-fifth steps-container">
            <img src="../../assets/fifth.png" alt="find" />
            <p>Start parking your vehicle.</p>
        </div>
        <div class="infographic-sixth steps-container">
            <img src="../../assets/sixth.png" alt="find" />
            <p>We will mark the parking as unavailable on ParkSpot.</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'InfographicSteps',
};
</script>

<style lang="scss" scoped>
$leftPos: 200px;
$rightPos: 735px;
.infographic-container {
    position: relative;

    @media only screen and (max-width: 1024px) {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 80px;
    }
    .infographic-bg-img {
        width: 100%;
        height: 1200px;
        position: relative;
        background-image: url('../../assets/infographic-line.png');
        background-position: center;
        background-repeat: no-repeat;

        @media only screen and (max-width: 1024px) {
            background-image: none;
            height: 20px;
        }
    }

    p {
        font-size: 24px;
        line-height: 29px;
    }
    .steps-container {
        width: 390px;
        text-align: center;
        position: absolute;
        @media only screen and (max-width: 1024px) {
            position: relative;
            top: unset !important;
            left: unset !important;
        }
    }

    .infographic-first {
        top: 210px;
        left: $leftPos;
    }
    .infographic-second {
        top: 330px;
        left: $rightPos;
    }
    .infographic-third {
        top: 535px;
        left: $leftPos;
    }
    .infographic-fourth {
        top: 625px;
        left: $rightPos;
    }
    .infographic-fifth {
        top: 845px;
        left: $leftPos;
    }
    .infographic-sixth {
        top: 935px;
        left: $rightPos;
    }
}
</style>