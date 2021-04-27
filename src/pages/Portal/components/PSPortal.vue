<template>
	<div>
		<Dashboard />
		<SummaryInfo 
		@tenant-id="toggleTenantId"
		:tenants="tenants"
		:tenantInfos="tenantInfos"
		:id="id"/>
		<SummaryDetails
		@add-building-detail="addBuildingDetail"
		@delete-detail-card="deleteDetailCard"
		:tenantInfos="tenantInfos"
		:id="id"/>
		<AddBuildingDetails 
		@add-site="addSite"
		@close-modal="closeModal"
		:showAdd="showAdd"
		:id="id"/>
	
	</div>
	
</template>

<script>
import Dashboard from './Dashboard.vue'
import SummaryInfo from './SummaryInfo.vue'
import SummaryDetails from './SummaryDetails.vue'
import AddBuildingDetails from './AddBuildingDetails.vue'
export default {
	name: 'PSPortal',
	components:{
		Dashboard,
		SummaryInfo,
		SummaryDetails,
		AddBuildingDetails
	},
	data(){
		return{
			tenantInfos:[],
			tenants:[],
			id:1 , //default value for tenant id
			showAdd : false
		}
	},
	methods:{
		addSite(newSite,index){
			console.log("heloo")
			//console.log(newSite)
			// console.log(this.tenantInfos[index-1])
			// this.tenantInfos[this.id].ParkingStatus.SiteWise=
			this.tenantInfos[index-1].ParkingStatus.SiteWise=[...this.tenantInfos[index-1].ParkingStatus.SiteWise,newSite]
		},
		toggleTenantId(id){
			this.id = id;
			// console.log(this.id);
		},
		addBuildingDetail(){
			this.showAdd = !this.showAdd;
			// console.log("hahah");
		},
		closeModal(){
			this.showAdd = !this.showAdd;
			//console.log("Hello")
		},
		deleteDetailCard(id,index){
			// console.log(id)
			// this.tenantInfos = [...this.tenantInfos]
			// const check = this.tenantInfos[index].ParkingStatus.SiteWise;
			// console.log([...check])
			const check = confirm("are you serius?")
			if(check){
				this.tenantInfos[index-1].ParkingStatus.SiteWise=this.tenantInfos[index-1].ParkingStatus.SiteWise.filter((tenantInfo)=>{
				return tenantInfo.SiteID != id ? tenantInfo : ''
			})
			}
			
		}
	
	},	
	created(){
		this.tenantInfos=[{
			api:"GET tenant/:tid/details",
			Success:true,
			ParkingStatus:{
				SiteWise:[{
					SiteID:"BLR#Inndiqube#1",
					Name:"Oracle Building",
					TotalSpots:{
						Car:100,
						Bike:5
						},
						Spots:[{
								ID:1,
								Status:0,
								VehichleType:1
							},
							{
								ID:10,
								Status:1,
								VehichleType:0
							}]
				},
				{
					SiteID:"BLR#Inndiqube#2",
					Name:"Oracle Building2",
					TotalSpots:{
						Car:30,
						Bike:15
						},
						Spots:[{
								ID:1,
								Status:0,
								VehichleType:1
							},
							{
								ID:10,
								Status:1,
								VehichleType:0
							}]
				}]},
				TotalSpots:{
					Car:100,
					Bike:5
					},
				VacantSpots:{
					Car:100,
					Bike:5
				}
			},
			{
			api:"GET tenant/:tid/details",
			Success:true,
			ParkingStatus:{
				SiteWise:[{
					SiteID:"BLR#Inndiqube#2",
					Name:"IBM Building",
					TotalSpots:{
						Car:50,
						Bike:25
						},
						Spots:[{
								ID:1,
								Status:0,
								VehichleType:1
							},
							{
								ID:10,
								Status:1,
								VehichleType:0
							}]
				}]},
				TotalSpots:{
					Car:20,
					Bike:15
					},
				VacantSpots:{
					Car:10,
					Bike:15
				}
			}],

		this.tenants=[
			{
				api:"GET entity/:eid/tenants",
				Success:true,
				TID:1,
				Name:"Softbank"
			},
			{
				api:"GET entity/:eid/tenants",
				Success:true,
				TID:2,
				Name:"Hardbank"
			}
		]
	}
}
</script>