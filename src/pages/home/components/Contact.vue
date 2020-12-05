<template lang="pug">
	.hero.is-fullheight.is-warning#contact
		.hero-head
			.columns
				.column.is-half.contact
					p.title.has-text-black.has-text-left
						|Contact Us
					br
					p.subtitle.has-text-black.has-text-left
						|Location:
					p.subtitle.has-text-black.has-text-left
						|Norbert Church Road, Off, Kasavanahalli Main Rd, 
						|Kasavanahalli, Karnataka 560035
					p.subtitle.has-text-black.has-text-left
						|Email: connect@parkspot.in
					p.subtitle.has-text-left 
						|Call: +91-80-9299-6057
					iframe(src="https://maps.google.com/maps?q=bhavya%20serene&t=&z=13&ie=UTF8&iwloc=&output=embed" height="45%" width="100%")
				.column.is-half.contact
					p.title.has-text-black.has-text-left Got suggestions?
					form(id="contactusform" class="form" action="https://api.sheetmonkey.io/form/4LQXCEMZFtaaSQMmXc7nbw" method="POST")
						label.label.has-text-black.has-text-left Name
						input(id="namec" class="input" type="text" name="Name" placeholder="Enter Name Here")
						label.label.has-text-black.has-text-left Email
						input(id="emailc" class="input" type="text" name="Email" placeholder="Enter Email id here")
						label.label.has-text-black.has-text-left City
						input(id="cityc" class="input" type="text" name="City" placeholder="Bangalore")
						label.label.has-text-black.has-text-left Authority type
						.control.level
							.select.level-left
								select(id="options" name="Authority type")
									option Parking Operator
									option Parking User
									option Others
						label.label.has-text-black.has-text-left Message
						textarea(id="messagec" class="textarea" name="Message" placeholder="Enter your suggestions; We are happy to listen")
						br
						button.button.is-dark Submit
</template>
<script>
export default{
	name: "contact"
}
</script>
<style scoped>
.contact {
  padding: 5%;
}
</style>
