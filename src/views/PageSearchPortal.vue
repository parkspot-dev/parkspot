<template>
    <TemplateSearchPortal
        :parkingRequests="parkingRequests"
        :isLoading="isLoading"
        @updateRequest="updateRequest"
        @toSrp="toSrp"
    ></TemplateSearchPortal>
</template>
<script>
import TemplateSearchPortal from '../components/templates/TemplateSearchPortal.vue';
export default {
    name: 'PageSearchPortal',
    components: {
        TemplateSearchPortal,
    },
    data() {
        return {
            parkingRequests: [],
            isLoading: false,
        };
    },
    created() {
        this.getParkingRequests();
    },
    methods: {
        async getParkingRequests() {
            this.isLoading = true;
            const res = await fetch(
                'https://maya.parkspot.in/internal/parking-requests',
            );
            const data = await res.json();
            this.parkingRequests = data;
            this.isLoading = false;
        },
        async updateRequest(request) {
            try {
                this.isLoading = true;
                const res = await fetch(
                    'https://maya.parkspot.in/owner/request-comments',
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(request),
                    },
                );

                await res.json();

                this.$buefy.toast.open({
                    message: `Sucessfully updated!`,
                    type: 'is-success',
                    duration: 2000,
                });
            } catch (error) {
                console.error({ error });

                this.$buefy.toast.open({
                    message: `Something went wrong!`,
                    type: 'is-danger',
                    duration: 2000,
                });
            }

            this.isLoading = false;
        },
        toSrp(lat, lng) {
            const latlng = [lat, lng].toString();
            const routeData = this.$router.resolve({
                name: 'srp',
                query: {
                    latlng,
                },
            });
            window.open(routeData.href, '_blank');
        },
    },
};
</script>
