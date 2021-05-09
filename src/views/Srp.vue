<template>
	<section>
		<PSNavbar />
		<SRP />
		<PSSrpDetails @on-book="onBookFormtoggle"  />
		<SrpBookForm v-if="showBookForm" :showBookForm="showBookForm" :index="index"  @on-cancel="onBookFormtoggles" @on-submit="onSubmit"/>
		<PSFooter />
	</section>
</template>
<script>
import PSNavbar from '@/components/PSNavbar.vue';
import PSFooter from '@/components/PSFooter.vue';
import SRP from '@/pages/srp/components/PSSrp.vue';
import PSSrpDetails from '@/pages/srp/components/PSSrpDetails.vue'
import SrpBookForm from '@/pages/srp/components/SrpBookForm.vue'
export default{
	name: "PSSrp",
	components: {
		PSNavbar,
		PSFooter,
		SRP,
		PSSrpDetails,
		SrpBookForm
	} ,
	data(){
		return{
			showBookForm : false,
			index:""
		}
	},
	methods:{
		async onSubmit(book){
			//console.log("HEllo")
			this.showBookForm=!this.showBookForm
			 console.log(book)

			const res = await fetch("https://maya.parkspot.in/booking/tentative",{
				method:'POST',
				headers:{
					'Content-Type':'application/json',
					'cookies' : true
				},
				body:JSON.stringify({
				UserInfo: {
					ID: book.ID,
					Name: book.name,
					Mobile: book.mno,
					EmailID: book.email,
					VehicleNO: "KA01JE3635"}
				})
			})
			const data = await res.text();
			// const check =JSON.parse(data)
			console.log("this"+data)
		},
		onBookFormtoggle(index){
			this.showBookForm=!this.showBookForm
			// console.log(index)
			// console.log(this.showBookForm)
			this.index=index
		},
		onBookFormtoggles(){
			this.showBookForm=!this.showBookForm
			
		}
	}
}
</script>
