<template>
    <div class="root">
        <aside class="toc">
            <div class="toc-heading">Vehicle Owner</div>
            <ul>
                <li>
                    <a
                        href="#submission-documents"
                        :class="{
                            active: activeSection === 'submission-documents',
                        }"
                        @click.prevent="scrollTo('submission-documents')"
                    >
                        Submission of Documents
                    </a>
                </li>
            </ul>
            <ul>
                <li>
                    <a
                        href="#accuracy-information"
                        :class="{
                            active: activeSection === 'accuracy-information',
                        }"
                        @click.prevent="scrollTo('accuracy-information')"
                    >
                        Accuracy of Information
                    </a>
                </li>
            </ul>
            <ul>
                <li>
                    <a
                        href="#confidentiality"
                        :class="{ active: activeSection === 'confidentiality' }"
                        @click.prevent="scrollTo('confidentiality')"
                    >
                        Confidentiality
                    </a>
                </li>
            </ul>
            <ul>
                <li>
                    <a
                        href="#verification-process"
                        :class="{
                            active: activeSection === 'verification-process',
                        }"
                        @click.prevent="scrollTo('verification-process')"
                    >
                        Verification Process
                    </a>
                </li>
            </ul>
            <ul>
                <li>
                    <a
                        href="#suspension-services"
                        :class="{
                            active: activeSection === 'suspension-services',
                        }"
                        @click.prevent="scrollTo('suspension-services')"
                    >
                        Suspension of Services
                    </a>
                </li>
            </ul>
            <ul>
                <li>
                    <a
                        href="#digital-management"
                        :class="{
                            active: activeSection === 'digital-management',
                        }"
                        @click.prevent="scrollTo('digital-management')"
                    >
                        Digital Management
                    </a>
                </li>
            </ul>
            <ul>
                <li>
                    <a
                        href="#subletting-assignment"
                        :class="{
                            active: activeSection === 'subletting-assignment',
                        }"
                        @click.prevent="scrollTo('subletting-assignment')"
                    >
                        Subletting & Assignment
                    </a>
                </li>
            </ul>
            <ul>
                <li>
                    <a
                        href="#cancellation"
                        :class="{ active: activeSection === 'cancellation' }"
                        @click.prevent="scrollTo('cancellation')"
                    >
                        Cancellation
                    </a>
                </li>
            </ul>
            <ul>
                <li>
                    <a
                        href="#landlord-cooperation"
                        :class="{
                            active: activeSection === 'landlord-cooperation',
                        }"
                        @click.prevent="scrollTo('landlord-cooperation')"
                    >
                        Landlord Cooperation in Unfortunate Events
                    </a>
                </li>
            </ul>
            <ul>
                <li>
                    <a
                        href="#prepaid-rent"
                        :class="{ active: activeSection === 'prepaid-rent' }"
                        @click.prevent="scrollTo('prepaid-rent')"
                    >
                        Prepaid Rent and Service Fee
                    </a>
                </li>
            </ul>
            <div class="toc-heading">Spot Owner</div>

            <div>
                <ul>
                    <li>
                        <a
                            href="#listing-creation"
                            :class="{
                                active: activeSection === 'listing-creation',
                            }"
                            @click.prevent="scrollTo('listing-creation')"
                        >
                            Listing Creation
                        </a>
                    </li>
                </ul>
                <ul>
                    <li>
                        <a
                            href="#ownership-authentication"
                            :class="{
                                active:
                                    activeSection ===
                                    'ownership-authentication',
                            }"
                            @click.prevent="
                                scrollTo('ownership-authentication')
                            "
                        >
                            Ownership Authentication
                        </a>
                    </li>
                </ul>
                <ul>
                    <li>
                        <a
                            href="#documentation-requirement"
                            :class="{
                                active:
                                    activeSection ===
                                    'documentation-requirement',
                            }"
                            @click.prevent="
                                scrollTo('documentation-requirement')
                            "
                        >
                            Documentation Requirement
                        </a>
                    </li>
                </ul>
                <ul>
                    <li>
                        <a
                            href="#termination-services"
                            :class="{
                                active:
                                    activeSection === 'termination-services',
                            }"
                            @click.prevent="scrollTo('termination-services')"
                        >
                            Termination of Services
                        </a>
                    </li>
                </ul>
                <ul>
                    <li>
                        <a
                            href="#customer-referral"
                            :class="{
                                active: activeSection === 'customer-referral',
                            }"
                            @click.prevent="scrollTo('customer-referral')"
                        >
                            Customer Referral Restriction
                        </a>
                    </li>
                </ul>
                <ul>
                    <li>
                        <a
                            href="#monthly-service"
                            :class="{
                                active: activeSection === 'monthly-service',
                            }"
                            @click.prevent="scrollTo('monthly-service')"
                        >
                            Monthly Service Fee
                        </a>
                    </li>
                </ul>
                <ul>
                    <li>
                        <a
                            href="#rent-handling"
                            :class="{
                                active: activeSection === 'rent-handling',
                            }"
                            @click.prevent="scrollTo('rent-handling')"
                        >
                            Rent Handling
                        </a>
                    </li>
                </ul>
                <ul>
                    <li>
                        <a
                            href="#refund"
                            :class="{ active: activeSection === 'refund' }"
                            @click.prevent="scrollTo('refund')"
                        >
                            Refund
                        </a>
                    </li>
                </ul>
                <ul>
                    <li>
                        <a
                            href="#cancellation-policies"
                            :class="{
                                active:
                                    activeSection === 'cancellation-policies',
                            }"
                            @click.prevent="scrollTo('cancellation-policies')"
                        >
                            Cancellation Policies
                        </a>
                    </li>
                </ul>
                <ul>
                    <li>
                        <a
                            href="#changes"
                            :class="{ active: activeSection === 'changes' }"
                            @click.prevent="scrollTo('changes')"
                        >
                            Changes to These Terms and Conditions
                        </a>
                    </li>
                </ul>
            </div>
        </aside>

        <main>
            <BodyWrapper>
                <div class="terms-container">
                    <AtomHeading class="mb-10">
                        Terms and Conditions
                    </AtomHeading>
                    <AtomParagraph class="vo">
                        Vehicle Owner : User who is seeking/finding a parking
                        spot.
                    </AtomParagraph>

                    <div class="mb-3">
                        <AtomParagraph
                            :variation="'large'"
                            id="submission-documents"
                        >
                            Submission of Documents:
                        </AtomParagraph>
                        <ul class="pl-6" style="list-style-type: disc">
                            <li>
                                <AtomParagraph>
                                    Vehicle owners are required to submit a copy
                                    of a valid government-issued identity card.
                                </AtomParagraph>
                            </li>
                            <li>
                                <AtomParagraph>
                                    Vehicle owners must submit Vehicle ownership
                                    documents, including the Registration
                                    Certificate (RC) or proof of insurance.
                                </AtomParagraph>
                            </li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <AtomParagraph
                            :variation="'large'"
                            id="accuracy-information"
                        >
                            Accuracy of Information:
                        </AtomParagraph>
                        <ul class="pl-6" style="list-style-type: disc">
                            <li>
                                <AtomParagraph>
                                    The vehicle owner specifies that all
                                    information provided during the KYC process
                                    is accurate, complete, and up-to-date.
                                </AtomParagraph>
                            </li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <AtomParagraph
                            :variation="'large'"
                            id="confidentiality"
                        >
                            Confidentiality:
                        </AtomParagraph>
                        <ul class="pl-6" style="list-style-type: disc">
                            <li>
                                <AtomParagraph>
                                    ParkSpot assures that all submitted
                                    documents will be treated with the utmost
                                    confidentiality and will only be used for
                                    the purpose of verifying ownership.
                                </AtomParagraph>
                            </li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <AtomParagraph
                            :variation="'large'"
                            id="verification-process"
                        >
                            Verification Process:
                        </AtomParagraph>
                        <ul class="pl-6" style="list-style-type: disc">
                            <li>
                                <AtomParagraph>
                                    ParkSpot team will review the submitted
                                    documents of the vehicle owner and reserve
                                    the right to request additional information
                                    or clarification if needed from the vehicle
                                    owner.
                                </AtomParagraph>
                            </li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <AtomParagraph
                            :variation="'large'"
                            id="suspension-services"
                        >
                            Suspension of Services:
                        </AtomParagraph>
                        <ul class="pl-6" style="list-style-type: disc">
                            <li>
                                <AtomParagraph>
                                    ParkSpot team reserves the right to refuse
                                    service to any user who fails to meet our
                                    KYC requirements or engages in activities
                                    that violate our terms and conditions.
                                </AtomParagraph>
                            </li>
                            <li>
                                <AtomParagraph>
                                    If the Vehicle Owner vacates the premises
                                    without paying the current month's rent or
                                    clearing past arrears, and the property
                                    remains unoccupied for 10 consecutive days,
                                    the ParkSpot has the right to terminate the
                                    booking and barring re-entry of the vehicle
                                    owner.
                                </AtomParagraph>
                            </li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <AtomParagraph
                            :variation="'large'"
                            id="digital-management"
                        >
                            Digital Management:
                        </AtomParagraph>
                        <ul class="pl-6" style="list-style-type: disc">
                            <li>
                                <AtomParagraph>
                                    The vehicle owner agrees to use the services
                                    from ParkSpot (Neospot Technologies Private
                                    Limited) only for Digital Management
                                    including online rent payment and managing
                                    booking. ParkSpot’s liability will be
                                    limited to the same.
                                </AtomParagraph>
                            </li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <AtomParagraph
                            :variation="'large'"
                            id="subletting-assignment"
                        >
                            Subletting & Assignment:
                        </AtomParagraph>
                        <ul class="pl-6" style="list-style-type: disc">
                            <li>
                                <AtomParagraph>
                                    The Vehicle Owner shall be entitled to use
                                    the scheduled premises for parking his
                                    vehicle only. Permission to sublease will be
                                    determined by the sole discretion of the
                                    Landlord(the parking spot owner) and
                                    ParkSpot.
                                </AtomParagraph>
                            </li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <AtomParagraph :variation="'large'" id="cancellation">
                            Cancellation:
                        </AtomParagraph>
                        <ul class="pl-6" style="list-style-type: disc">
                            <li>
                                <AtomParagraph>
                                    For cancellation of the active booking of a
                                    vehicle owner, he/she(the vehicle owner)
                                    will have to give one month prior notice to
                                    the ParkSpot team. Failing to which the
                                    ParkSpot team has the right to use the
                                    security deposit(If the vehicle owner has
                                    paid the security deposit) to pay the rent
                                    for next month.
                                </AtomParagraph>
                            </li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <AtomParagraph
                            :variation="'large'"
                            id="landlord-cooperation"
                        >
                            Landlord Cooperation in Unfortunate Events:
                        </AtomParagraph>
                        <ul class="pl-6" style="list-style-type: disc">
                            <li>
                                <AtomParagraph>
                                    In the event of any unfortunate incidents,
                                    the spot owner will promptly inform the
                                    vehicle owner and offer assistance in the
                                    investigation. It is expressly understood
                                    that the spot owner will not be held
                                    responsible for such events. Additionally,
                                    the landlord will cooperate by providing
                                    CCTV recording footage to aid in the
                                    investigation process. This clause aims to
                                    facilitate collaboration between the parties
                                    in addressing unforeseen circumstances while
                                    clarifying the landlord's liability.
                                </AtomParagraph>
                            </li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <AtomParagraph :variation="'large'" id="prepaid-rent">
                            Prepaid Rent and Service Fee:
                        </AtomParagraph>
                        <ul class="pl-6" style="list-style-type: disc">
                            <li>
                                <AtomParagraph>
                                    Rent and security deposit are required to be
                                    prepaid. Additionally, a one-time service
                                    fee must be paid by the vehicle owner before
                                    obtaining the spot owner's contact details.
                                    This service fee is fully refundable if the
                                    user decides not to proceed with booking the
                                    parking spot. This service charge is
                                    non-refundable if the customer confirms the
                                    booking.
                                </AtomParagraph>
                            </li>
                        </ul>
                    </div>

                    <AtomParagraph class="vo">
                        Spot Owner : User who is renting out his/her parking
                        spot .
                    </AtomParagraph>

                    <div class="mb-3">
                        <AtomParagraph
                            :variation="'large'"
                            id="listing-creation"
                        >
                            Listing Creation:
                        </AtomParagraph>
                        <ul class="pl-6" style="list-style-type: disc">
                            <li>
                                <AtomParagraph>
                                    The ParkSpot company undertakes to create a
                                    comprehensive listing for the parking spot
                                    on its website and mobile app.
                                </AtomParagraph>
                            </li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <AtomParagraph
                            :variation="'large'"
                            id="ownership-authentication"
                        >
                            Ownership Authentication:
                        </AtomParagraph>
                        <ul class="pl-6" style="list-style-type: disc">
                            <li>
                                <AtomParagraph>
                                    The spot owner must provide authentic
                                    documents verifying ownership of the parking
                                    spot.
                                </AtomParagraph>
                            </li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <AtomParagraph
                            :variation="'large'"
                            id="documentation-requirement"
                        >
                            Documentation Requirement:
                        </AtomParagraph>
                        <ul class="pl-6" style="list-style-type: disc">
                            <li>
                                <AtomParagraph>
                                    Failing to provide the necessary documents
                                    for ownership verification may result in the
                                    removal of the parking spot from the
                                    ParkSpot portal.
                                </AtomParagraph>
                            </li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <AtomParagraph
                            :variation="'large'"
                            id="termination-services"
                        >
                            Termination of Services:
                        </AtomParagraph>
                        <ul class="pl-6" style="list-style-type: disc">
                            <li>
                                <AtomParagraph>
                                    In the event of non-compliance with
                                    ownership verification requirements,
                                    ParkSpot reserves the right to remove the
                                    parking spot from the platform.
                                </AtomParagraph>
                            </li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <AtomParagraph
                            :variation="'large'"
                            id="customer-referral"
                        >
                            Customer Referral Restriction:
                        </AtomParagraph>
                        <ul class="pl-6" style="list-style-type: disc">
                            <li>
                                <AtomParagraph>
                                    If the ownership verification process is not
                                    successfully completed, ParkSpot will
                                    withhold customer referrals to the spot
                                    owner until the necessary documentation is
                                    provided.
                                </AtomParagraph>
                            </li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <AtomParagraph
                            :variation="'large'"
                            id="monthly-service"
                        >
                            Monthly Service Fee:
                        </AtomParagraph>
                        <ul class="pl-6" style="list-style-type: disc">
                            <li>
                                <AtomParagraph>
                                    As part of the agreement, the spot owner
                                    acknowledges and agrees to pay the ParkSpot
                                    company a monthly service fee for each month
                                    the parking spot is booked through the
                                    Company's platform. This service fee will be
                                    deducted directly from the monthly rent
                                    collected from the vehicle owner. By
                                    entering into this arrangement, both parties
                                    acknowledge their understanding and
                                    acceptance of this financial arrangement
                                    associated with the services provided by the
                                    Company.
                                </AtomParagraph>
                            </li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <AtomParagraph :variation="'large'" id="rent-handling">
                            Rent Handling:
                        </AtomParagraph>
                        <ul class="pl-6" style="list-style-type: disc">
                            <li>
                                <AtomParagraph>
                                    The ParkSpot company will collect monthly
                                    rent from the vehicle owner(the parkspot
                                    user who has booked the parking spot through
                                    our portal), after deducting a service fee,
                                    and promptly deposit the balance into the
                                    landlord's designated bank account. Both
                                    parties acknowledge and accept these
                                    streamlined procedures for efficient
                                    financial transactions.
                                </AtomParagraph>
                            </li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <AtomParagraph :variation="'large'" id="refund">
                            Refund :
                        </AtomParagraph>
                        <ul class="pl-6" style="list-style-type: disc">
                            <li>
                                <AtomParagraph>
                                    Only if booking cancelled within 15 days of
                                    booking or before parking start date
                                    (whichever is early).
                                </AtomParagraph>
                            </li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <AtomParagraph
                            :variation="'large'"
                            id="cancellation-policies"
                        >
                            Cancellation Policies :
                        </AtomParagraph>
                        <ul class="pl-6" style="list-style-type: disc">
                            <li>
                                <AtomParagraph>
                                    Cancellation request of the ongoing booking
                                    must be made in one month advance.
                                </AtomParagraph>
                            </li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <AtomParagraph :variation="'large'" id="changes">
                            Changes to These Terms and Conditions :
                        </AtomParagraph>
                        <ul class="pl-6" style="list-style-type: disc">
                            <li>
                                <AtomParagraph>
                                    We reserve the right, at Our sole
                                    discretion, to modify or replace these Terms
                                    at any time.What constitutes a material
                                    change will be determined at Our sole
                                    discretion.By continuing to access or use
                                    Our Service after those revisions become
                                    effective, You agree to be bound by the
                                    revised terms. If You do not agree to the
                                    new terms, in whole or in part, please stop
                                    using the website and the Service.
                                </AtomParagraph>
                            </li>
                        </ul>
                    </div>
                </div>
            </BodyWrapper>
        </main>
    </div>
</template>

<script>
import AtomHeading from '../atoms/AtomHeading.vue';
import AtomParagraph from '../atoms/AtomParagraph.vue';
import BodyWrapper from '../extras/BodyWrapper.vue';

export default {
    name: 'TemplateTerms',
    components: {
        AtomHeading,
        AtomParagraph,
        BodyWrapper,
    },
    data() {
        return {
            activeSection: '',
        };
    },
    methods: {
        scrollTo(id) {
            const element = document.getElementById(id);
            if (element) {
                history.pushState(null, null, `#${id}`);
                // Calculate offset based on screen size
                const isMobile = window.innerWidth <= 768;
                const isIPad = window.innerWidth <= 1300;
                let offset = isIPad ? -2000 : 10;
                offset = isMobile ? -600 : 10;
                scrollTo({
                    top: element.offsetTop - offset,
                    behavior: 'smooth',
                });
                this.activeSection = id;
            }
        },
    },
  mounted() {
        setTimeout(() => {
            const scrollActiveSection = window.location.hash.slice(1);
            if (scrollActiveSection) {
                this.scrollTo(scrollActiveSection);
            }
        }, 100);
    },
};
</script>

<style scoped>

.root {
    display: flex;
    gap: 2rem;
}

/* Table of Contents (TOC) */
.toc {
    background: var(--parkspot-white);
    border-radius: var(--border-default);
    border: 8px solid var(--parkspot-white);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    height: fit-content;
    margin: 1rem 1rem;
    max-height: 86vh;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0.4rem 1rem;
    position: sticky;
    top: 5.4rem;
    transition: box-shadow 0.4s ease, background-color 0.4s ease;
    width: 20%;
}

.toc-heading {
    border-bottom: 2px solid var(--parkspot-black);
    font-size: 1.2rem;
    font-weight: var(--regular-font);
    padding-bottom: 0.1rem;
    text-transform: capitalize;
}

.toc ul li {
    position: relative;
    margin: 0.5rem 0.3rem;
    padding-left: 0.7rem;
    list-style: none;
}

.toc ul li a {
    color: var(--secondary-color);
    display: block;
    font-size: 0.9rem;
    font-weight: var(--regular-font);
    text-decoration: none;
    transition: color 0.4s ease, text-decoration 0.4s ease;
}

.toc ul li a:hover {
    color: var(--parkspot-black);
    text-decoration: underline;
}

.toc ul li::before {
    content: '•';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    color: var(--secondary-color);
}

.vo {
    border-color: var(--secondary-color);
    border-inline-start: 4px solid var(--secondary-color);
    font-size: 1.8rem;
    font-weight: var(--semi-bold-font);
    margin: 1.5rem 0;
    padding: 1rem;
}

/* Mobile styles (screen width <= 768px) */
@media screen and (max-width: 768px) {
    .root {
        flex-direction: column;
    }
    .toc {
        border-radius: 0;
        box-shadow: none;
        margin: 0;
        padding: 1rem;
        position: static;
        width: 100%;
    }

    main {
        margin-left: 0;
        margin-right: 0;
        transform: translateY(0%);
    }
}

/* Tablet styles (screen width between 769px and 1300px) */
@media screen and (min-width: 769px) and (max-width: 1300px) {
    .toc {
        max-height: 80vh;
        width: 25%;
    }
}

</style>