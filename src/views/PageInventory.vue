<template>
  <TemplateInventory
    :lists="spotDetails"
    :isLoading="isLoading"
    @updateRequest="updateRequest"
    @toSrp="toSrp"
  ></TemplateInventory>
</template>
<script>
import TemplateInventory from '../components/templates/TemplateInventory.vue';
export default {
  name: 'PageInventory',
  components: {
    TemplateInventory,
  },
  data() {
    return {
      spotDetails: [],
      isLoading: false,
    };
  },
  created() {
    this.getSpotDetails();
  },
  methods: {
    async getSpotDetails() {
      this.isLoading = true;
      const res = await fetch(
        'https://maya.parkspot.in/internal/parking-requests',
      );
      const data = await res.json();
      this.spotDetails = data;
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
      const routeData = this.$router.resolve({
        name: 'srp',
        query: {
          lat: lat,
          lng: lng,
        },
      });
      window.open(routeData.href, '_blank');
    },
  },
};
</script>
