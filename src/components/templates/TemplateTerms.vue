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
                        href="#booking-conditions"
                        :class="{
                            active: activeSection === 'booking-conditions',
                        }"
                        @click.prevent="scrollTo('booking-conditions')"
                    >
                        Booking Conditions
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
                                    All vehicle owners must provide a valid
                                    government-issued ID card.
                                </AtomParagraph>
                            </li>
                            <li>
                                <AtomParagraph>
                                    Vehicle owners must provide proof of
                                    ownership, such as the Registration
                                    Certificate (RC) or valid insurance
                                    documents.”
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
                                    Vehicle owners must ensure that all details
                                    provided during the KYC process are
                                    accurate, complete, and up to date.
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
                                    ParkSpot guarantees that all submitted
                                    documents will remain confidential and will
                                    only be used to verify vehicle ownership.
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
                                    The ParkSpot team will review the submitted
                                    documents and may request additional
                                    information or clarification if needed.
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
                                    ParkSpot reserves the right to refuse
                                    service to any user who does not meet KYC
                                    requirements or violates our terms and
                                    conditions.
                                </AtomParagraph>
                            </li>
                            <li>
                                <AtomParagraph>
                                    If a vehicle owner leaves without paying the
                                    current month’s rent or clearing past dues,
                                    and the property stays unoccupied for 10
                                    days in a row, ParkSpot may cancel the
                                    booking and deny re-entry.
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
                                    The vehicle owner agrees to use ParkSpot
                                    (Neospot Technologies Pvt. Ltd.) only for
                                    digital management services, such as online
                                    rent payments and booking management.
                                    ParkSpot’s responsibility is limited to
                                    these services.
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
                                    The vehicle owner may use the allotted
                                    premises only for parking their vehicle.
                                    Subleasing is not allowed unless approved by
                                    both the landlord (parking spot owner) and
                                    ParkSpot.
                                </AtomParagraph>
                            </li>
                        </ul>
                    </div>

                    <div class="mb-3">
                        <AtomParagraph
                            :variation="'large'"
                            id="booking-conditions"
                        >
                            Booking Conditions:
                        </AtomParagraph>
                        <ul class="pl-6" style="list-style-type: disc">
                            <li>
                                <AtomParagraph>
                                    Facilities may differ from one parking spot
                                    to another. For exact details, please
                                    contact the spot owner.
                                </AtomParagraph>
                            </li>
                            <li>
                                <AtomParagraph>
                                    Spot owners have the right to decline any
                                    booking.
                                </AtomParagraph>
                            </li>
                            <li>
                                <AtomParagraph>
                                    A parking spot will not be reserved until
                                    rent has been paid.
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
                                    To cancel an active booking, the vehicle
                                    owner must give ParkSpot at least one
                                    month’s prior notice. If no notice is given,
                                    ParkSpot may use the security deposit (if
                                    paid) to cover the next month’s rent.
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
                                    In case of any unfortunate incident, the
                                    spot owner will inform the vehicle owner and
                                    assist in the investigation. The spot owner
                                    will not be held responsible for such
                                    events. The landlord will also cooperate by
                                    providing CCTV footage if available. This
                                    ensures cooperation while clarifying that
                                    the landlord is not liable.
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
                                    Rent and security deposit must be paid in
                                    advance. A one-time service fee is also
                                    required before receiving the spot owner’s
                                    contact details. This fee is fully
                                    refundable if the user chooses not to book
                                    the parking spot. However, once the booking
                                    is confirmed, the service fee becomes
                                    non-refundable.
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
                                    ParkSpot will create a detailed listing for
                                    the parking spot on its website and mobile
                                    app.
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
                                    The spot owner must provide valid documents
                                    that prove ownership of the parking spot.
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
                                    If the required ownership documents are not
                                    provided, the parking spot may be removed
                                    from the ParkSpot portal.
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
                                    If ownership verification requirements are
                                    not met, ParkSpot may remove the parking
                                    spot from the platform.”
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
                                    If ownership verification is not completed,
                                    ParkSpot will withhold customer referrals
                                    until the required documents are provided.
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
                                    The spot owner agrees to pay ParkSpot a
                                    monthly service fee for each month the
                                    parking spot is booked through the platform.
                                    This fee will be deducted from the rent
                                    collected from the vehicle owner. By using
                                    the service, both parties accept this
                                    payment arrangement.
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
                                    ParkSpot will collect the monthly rent from
                                    the vehicle owner, deduct the service fee,
                                    and deposit the remaining amount into the
                                    landlord’s designated bank account. Both
                                    parties agree to this process for smooth
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
                                    Refunds apply only if the booking is
                                    cancelled within 15 days of booking or
                                    before the parking start date, whichever
                                    comes first.
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
                                    We may update or change these Terms at any
                                    time. What counts as a major change will be
                                    decided by us. By continuing to use our
                                    service after changes take effect, you agree
                                    to the new terms. If you do not agree,
                                    please stop using the website and service.
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
                const offset = isMobile ? -600 : isIPad ? -10 : 10;
                scrollTo({
                    top: element.offsetTop - offset,
                    behavior: 'smooth',
                });
                this.activeSection = id;
            }
        },
    },
    mounted() {
        if (window.location.hash) {
            this.$nextTick(() => {
                // TODO: Use requestAnimationFrame for optimization instead of setTimeout
                setTimeout(() => {
                    const scrollActiveSection = window.location.hash.slice(1);
                    if (scrollActiveSection) {
                        this.scrollTo(scrollActiveSection);
                    }
                }, 300);
            });
        }
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
    transition:
        box-shadow 0.4s ease,
        background-color 0.4s ease;
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
    list-style: none;
    margin: 0.5rem 0.3rem;
    padding-left: 0.7rem;
    position: relative;
}

.toc ul li a {
    color: var(--secondary-color);
    display: block;
    font-size: 0.9rem;
    font-weight: var(--regular-font);
    text-decoration: none;
    transition:
        color 0.4s ease,
        text-decoration 0.4s ease;
}

.toc ul li a:hover {
    font-weight: 500;
}

.toc ul li::before {
    color: var(--secondary-color);
    content: '•';
    left: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
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
