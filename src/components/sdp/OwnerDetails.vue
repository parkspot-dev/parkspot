<template>
    <div class="spot-detail-owner" v-if="ownerInfoDetails.UserName">
        <hr style="width: 100%; margin-top: 80px" />
        <h2>Owner Info Details</h2>
        <div class="spot-detail-owner-body">
            <div>
                <table>
                    <tr v-if="ownerInfoDetails.FullName">
                        <td>FullName</td>
                        <td>{{ ownerInfoDetails.FullName }}</td>
                    </tr>
                    <tr v-if="ownerInfoDetails.Mobile">
                        <td>Mobile</td>
                        <td>{{ ownerInfoDetails.Mobile }}</td>
                    </tr>
                    <tr v-if="ownerInfoDetails.AlternateMobile">
                        <td>Alternate Mobile</td>
                        <td>{{ ownerInfoDetails.AlternateMobile }}</td>
                    </tr>
                    <tr v-if="ownerInfoDetails.City">
                        <td>City</td>
                        <td>{{ ownerInfoDetails.City }}</td>
                    </tr>
                    <tr v-if="ownerInfoDetails.EmailID">
                        <td>EmailID</td>
                        <td>{{ ownerInfoDetails.EmailID }}</td>
                    </tr>
                    <tr v-if="ownerInfoDetails.KYCStatus">
                        <td>KYCStatus</td>
                        <td>
                            {{ getKYCStatus(ownerInfoDetails.KYCStatus) }}
                        </td>
                    </tr>
                    <tr v-if="spotDetails.UpdatedAt">
                        <td>Last Call Date</td>
                        <td>
                            <AtomDatePicker
                                :assignedDate="spotDetails.LastCallDate"
                                :size="'is-small'"
                                @changed="changeLastCallDate"
                            >
                            </AtomDatePicker>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="goto-btn">
                <AtomButton
                    @click.native="
                        goToInterestedVO([spotDetails.Lat, spotDetails.Long])
                    "
                >
                    Interested VO's
                </AtomButton>
            </div>
            <div class="goto-btn" v-if="isAvailable">
                <AtomButton @click.native="changeAvailability(-1)">
                    Mark Rented
                </AtomButton>
            </div>
            <div class="goto-btn" v-if="!isAvailable">
                <AtomButton @click.native="changeAvailability(1)">
                    Mark Available
                </AtomButton>
            </div>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
