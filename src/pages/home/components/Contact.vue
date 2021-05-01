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
						|2nd Floor, Nextcoworks BTM Layout,<br> 
						|BTM 2nd Stage, Bengaluru, Karnataka 560076 
					p.subtitle.has-text-black.has-text-left
						|Email: connect@parkspot.in
					p.subtitle.has-text-left 
						|Call: +91 80929 96057
					iframe(src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/77.6059,12.915,12.69,0/305x120@2x?access_token=pk.eyJ1IjoiYmZyaWVkbHkiLCJhIjoiY2p4bHd1OXdpMGFycDN0bzFiNWR4d2VyNyJ9.3hQjvgyoPoCuRx-Hqr_BFQ" height="47%" width="100%")
				.column.is-half.contact 
					p.title.has-text-black.has-text-left Got suggestions?
					form(id="contactusform" v-if="!isContacted" class="form"  method="POST"  )
						label.label.has-text-black.has-text-left Name
						input(id="namec" v-model="FullName" class="input" type="text" name="Name" placeholder="Enter Name Here")
						label.label.has-text-black.has-text-left Email
						input(id="emailc" v-model="EmailID" class="input" type="text" name="Email" placeholder="Enter Email id here")
						label.label.has-text-black.has-text-left City
						input(id="cityc" v-model="City" class="input" type="text" name="city" placeholder="Bangalore")
						label.label.has-text-black.has-text-left Contact No.
						input(id="mobilec" v-model="Mobile" class="input" type="tel" name="mobile" placeholder="+91 ")
						label.label.has-text-black.has-text-left Message
						textarea(id="messagec" v-model="Comments" class="textarea" name="Message" placeholder="Enter your suggestions; We are happy to listen")
						br
						button(class="button is-dark" v-on:click.prevent="post") Submit
					h1(id="ContactButton" v-if="isContacted" class="title center-contact")
						|Thank you for contacting us!!
						//- https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/77.6059,12.915,12.69,0/300x200@2x?access_token=YOUR_MAPBOX_ACCESS_TOKEN https://maps.google.com/maps?q=2nd%20Floor,%20Nextcoworks%20BTM%20Layout,%20Ranka%20Colony%20Rd,%20Munivenkatppa%20Layout,%20BTM%202nd%20Stage,%20Bengaluru,%20Karnataka%20560076+(ParkSpot)&t=&z=14&ie=UTF8&iwloc=B&output=embed
					
</template>
<script>

export default{
	name: "contact",
	data(){
		return{
			FullName:"",
			City:"",
			EmailID:"",
			Mobile:"",
			Comments:"",
			isContacted:false
		}

	},
	methods:{
		post:function(){
			
			var isMweb = false
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				isMweb = true
			}
			var flavor = isMweb ? "mweb" : "dweb"
			console.log(flavor)
			this.isContacted = !this.isContacted
			this.$http.post("https://maya.parkspot.in/contact",{
				User:{FullName:this.FullName,
				EmailID:this.EmailID,
				City:this.City,
				Mobile:this.Mobile
				},
				Comments:this.Comments,
				Flavour:this.flavor
			}).then(function(data){
				console.log(data)
			})
		}
		
	}
}
</script>
<style scoped>
.contact {
  padding: 5%;
}
.center-contact{
	margin-top: 250px;
}
</style>
