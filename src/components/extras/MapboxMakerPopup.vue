<template>
    <div dir="ltr" style="">
        <div class="poi-info-window gm-style">
            <div>
                <div class="title full-width" jsan="7.title,7.full-width">
                    ${spot.Name}
                </div>
                <div class="address">
                    <div
                        jsinstance="0"
                        class="address-line full-width"
                        jsan="7.address-line,7.full-width"
                    >
                        ${spot.Address}
                    </div>
                    <div
                        jsinstance="*3"
                        class="address-line full-width"
                        jsan="7.address-line,7.full-width"
                    >
                        India
                    </div>
                </div>
            </div>
            <div style="margin-top: 0.5rem">Distance: ${spot.Distance} Km</div>
            <div style="margin-top: 0.5rem">Click for map direction.</div>
            <div
                style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 1.5rem;
                "
            >
                <div
                    style="
                        font-size: 1rem;
                        font-weight: 700;
                        color: rgba(0, 95, 0, 1);
                        line-height: 1.25;
                    "
                >
                    &#8377; ${spot.Rate}/-
                </div>
                <button
                    style="
                        background-color: #ffe08a;
                        border-color: transparent;
                        border-radius: 3px;
                        color: rgba(0, 0, 0, 0.7);
                    "
                >
                    <a
                        style="
                            display: flex;
                            align-items: center;
                            background-color: #ffe08a;
                            color: rgba(0, 0, 0, 0.7);
                        "
                        href="https://www.parkspot.in/spot-details/${encodedSpotId}"
                        target="_blank"
                    >
                        <span style="font-size: 0.75rem; font-weight: 700">
                            View Spot
                        </span>
                        <span
                            style="
                                display: inline-flex;
                                width: 18px;
                                height: 21px;
                            "
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="pointer-events-none max-h-full max-w-full"
                            >
                                <g
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-miterlimit="10"
                                    stroke-width="2"
                                >
                                    <path
                                        vector-effect="non-scaling-stroke"
                                        d="M10 17l5-5M10 7l5 5"
                                    ></path>
                                </g>
                            </svg>
                        </span>
                    </a>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        spot: Object,
    },
    computed: {
        encodedSpotId() {
            return 'abc';
        },
    },
};
</script>

<style></style>
