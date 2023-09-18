<template>
    <div>
        <p>
            Parking has been a major concern in major cities. Due to fewer
            parking spaces, people have to spend a lot of time searching for the
            right spot. Another concern is the parking charges. Especially when
            it comes to Bangalore downtown, the charges are so high that it’s
            getting difficult day by day to afford to park there. In spite of
            these issues, the majority of people prefer driving to the workplace
            than using public transport. They feel it is much more convenient.
            They do not have to depend on the specific timings of public
            transport and can leave whenever they want to. Also, many of them
            have additional duties such as picking/ dropping their kids to
            school while coming to the office. So, having their own car helps in
            multitasking.
        </p>
        <br />
        <p>
            For some of the employees parking near the office has become an
            everyday challenge especially in cities like Bangalore. Some of
            these challenges include:
        </p>
        <br />
        <h3 class="is-size-3 has-text-semi-bold">Parking Challenges:</h3>
        <ol class="pl-5">
            <li>Insufficient Parking spots.</li>
            <li>
                No Parking option provided by offices, especially in downtowns.
            </li>
            <li>Lack of spots for the clients and customers.</li>
            <li>Rule Violations.</li>
            <li>Inappropriate Parking ratio.</li>
            <li>A lot of time spent on finding a parking spot.</li>
        </ol>
        <br />
        <p>
            Though it would take time to resolve these issues, it’s always
            beneficial to take steps towards improvement. Some of the simple yet
            effective solutions are:
        </p>
        <br />
        <h3 class="is-size-3 has-text-semi-bold">Solutions:</h3>
        <ol class="pl-5">
            <li>
                Stacked Spaces: Parking cars one after the other in form of
                stacks. This would work if the one who has parked the car inside
                would leave later. But this can not be the case always. So,
                figuring out a method through which only those cars that leave
                later get parked inside can somehow help solve the parking issue
                and a lot more cars will get parked this way. This can be done
                through valley parking.
            </li>
            <li>
                Transportation Allowance: The company can help its employees by
                providing an allowance for public transport or uber. This will
                help in encouraging them to use public transport and avoid
                coming by personal car.
            </li>
            <li>
                Talk to your employees: Getting to know personal insights and
                feedback is very important. Speak to your employees on this,
                what challenges do they face, what solutions would help them in
                this situation.
            </li>
            <li>
                Using ParkSpot App: ParkSpot provides a digital parking
                solution. The app has an interactive map that provides real-time
                data and helps users find and book a parking spot. The best part
                is that this online solution is user friendly and free of cost.
                ParkSpot app is available on google play. Download the app for
                free and sign up. if you have any questions, just call at
                <a :href="helplineRef"> {{ helplineNumber }}</a
                >, or email at connect@parkspot.in
            </li>
        </ol>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'OrganismBlogParkingChallenges',
    computed: {
        ...mapState('config', ['helplineNumber', 'helplineRef']),
    },
};
</script>
