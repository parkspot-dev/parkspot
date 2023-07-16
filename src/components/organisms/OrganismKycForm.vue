<template>
    <div class="kyc-form">
        <div class="kyc-form-header">
            <h1>KYC Verification</h1>
            <h2>Please fill all the fields</h2>
        </div>
        <div class="kyc-form-main">
            <ValidationObserver ref="observer" v-slot="{}">
                <div class="py-4">
                    <MoleculeRadioButton
                        :fieldName="'radio'"
                        :rules="validation.owner"
                        :values="KYC.OWNER_RADIO_DATA"
                        @data="updateOwner"
                        :currentSelectedRadio="KYC.OWNER_RADIO_DATA[0]"
                    >
                        Are you the Owner?
                    </MoleculeRadioButton>
                </div>
                <div class="py-4">
                    <MoleculeSelectInput
                        :fieldName="'input'"
                        :list="documentList"
                        @input="updateDocumentData"
                        :rules="validation.documentSelect"
                        :placeholder="'Select documents'"
                        :label="'Documents'"
                        :tooltip="true"
                        :tooltipMsg="KYC.DOCUMENT_INFO_MSG"
                    ></MoleculeSelectInput>
                </div>
                <div class="py-4">
                    <MoleculeUpload
                        @data="updateImg"
                        :fieldName="'document'"
                        :rules="validation.img"
                    ></MoleculeUpload>
                </div>
                <AtomButton class="is-pulled-right" @click.native="saveProfile">
                    Save Profile
                </AtomButton>
            </ValidationObserver>
        </div>
    </div>
</template>

<script>
import { ValidationObserver } from 'vee-validate';
import MoleculeRadioButton from '../molecules/MoleculeRadioButton.vue';
import MoleculeSelectInput from '../molecules/MoleculeSelectInput.vue';
import MoleculeUpload from '../molecules/MoleculeUpload.vue';
import AtomButton from '../atoms/AtomButton.vue';
import { mapMutations, mapState } from 'vuex';
import { KYC } from '../../constant/constant';
export default {
    name: 'OrganismKycForm',
    components: {
        ValidationObserver,
        MoleculeRadioButton,
        MoleculeSelectInput,
        MoleculeUpload,
        AtomButton,
    },
    data() {
        return {
            KYC,
            validation: {
                owner: '',
                documentSelect: 'required',
                img: 'required|image',
            },
            model: {
                owner: '',
                documentData: null,
                imgData: null,
            },
        };
    },
    computed: {
        ...mapState('user', {
            userType: (state) => state.userProfile.Type,
        }),
        documentList() {
            if (this.userType === 'VO') {
                return this.KYC.DOCUMENT_DATA_VO;
            } else {
                return this.KYC.DOCUMENT_DATA_SO;
            }
        },
    },
    methods: {
        ...mapMutations({
            updateKyc: 'user/update-kyc',
        }),
        saveProfile() {
            this.$refs.observer
                .validate()
                .then((sucess) => {
                    if (sucess) {
                        this.submit();
                    }
                })
                .catch((er) => {
                    console.log(er);
                });
        },

        updateOwner(owner) {
            owner === 'Yes'
                ? (this.model.owner = true)
                : (this.model.owner = false);
        },
        updateDocumentData(index) {
            this.model.documentData = this.documentValues[index].name;
        },
        updateImg(data) {
            this.model.imgData = data;
        },
    },
};
</script>

<style lang="scss" scoped>
.kyc-form-header {
    background-color: var(--secondary-color);
    padding: 20px 32px;
    margin-bottom: 32px;

    h1 {
        color: var(--parkspot-black);
        font-weight: 600;
        font-size: 24px;
    }

    h2 {
        color: #e8faff;
        font-size: 14px;
    }
}

.kyc-form-main {
    padding: 0 32px;
}
</style>
