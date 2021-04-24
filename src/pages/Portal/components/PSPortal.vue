
// to be deleted later
<template lang="pug">
	.container
		.level
			.level-left
				.level-item
					.title
						|	Dashboard
			//- .level-right
			//- 	.level-item
			//- 		.title
			//- 			|	Dashboard
		.columns.is-vcentered
			.column
				.label
						| All Tenants List
				.control
					.select
						select(v-model="selectedValue" v-on:change="getTenantInfo($event.target.value)")
							option(v-for="(tenantList,index) in tenantLists.Tenants" :value="tenantList.TID"  ) {{ tenantList.Name }}

			.column
				.box.notification.is-warning
					.field
						| Total No. of Parking Spot: {{ tenants.TotalSpots.Car + tenants.TotalSpots.Bike }}
					.field
						.level
							.level-left
								| Car : {{tenants.TotalSpots.Car}}
							.level-right
								| Bike : {{tenants.TotalSpots.Bike}}
			.column
				.box.notification.is-success
					.field
						| Total No. of Vacant Spot: {{ tenants.VacantSpots.Car + tenants.VacantSpots.Bike }}
					.field
						.level
							.level-left
								| Car :{{tenants.VacantSpots.Car}}
							.level-right
								| Bike :{{tenants.VacantSpots.Bike}}
			.column
				.box.notification.is-info
					.field
						| Total No. of Buiding: 5
		.columns
			.column.is-6
				table(id="parking-site",class="table table is-hoverable")
					thead
						tr
							th No.
							th Building Name
							th Car parking Spot
							th Bike Spot
							th Edit
					tbody
						tr(v-for="(site, index) in tenants.SiteWise")
							th {{index + 1}}
							td
								a(:id="index" v-on:click.once="getLayout($event.target.id)") {{site.Name}}
							td {{site.TotalSpots.Car}}
							td {{site.TotalSpots.Bike}}
							td 
								.button.is-danger.is-small( type='submit' v-on:click="deleteBuilding(index + 1)") Delete
								.button.is-info.is-small(type='submit'   v-on:click="EditBuildingModal()") Edit
								.button.is-success.is-small(type='submit' v-on:click="addBuildingModal()" ) Add
			.column.is-3
				table(id="park-map-car",class="table")
					tbody
						tr
							td(colspan="10")
								.title.is-4.is-centered
									|Car
			.column.is-3
				table(id="park-map-bike",class="table")
					tbody
						tr
							td(colspan="10")
								.title.is-4.is-centered
									|Bike
					
			//- button.btn.btn-primary(v-on:click="carmap") Submit
			//- button.btn.btn-primary(v-on:click="bikemap") Submit
			//- //- button.btn.btn-primary(v-on:click="getParkingSite") site
			//- //- div
			//- //- 	
		div(v-if="addBuildingModalCheck" )
		div(class="modal is-vcentered" :class="{'is-active': addBuildingModalCheck}" )
			.modal-background
				.modal-card
					.modal-card-head
						p.modal-card-title {{Action}} Building Details
						button.delete(aria-label="close" v-on:click="addBuildingModal()")
					.modal-card-body
						.form(action="" method="method")
							.label.level-left Building Name:
							.input(type="text")
							br
							br
							.label.level-left No.of Car Spot
							.input(type="number")
							br
							br
							.label.level-left No.of Bike Spot
							.input(type="number")
					.modal-card-foot
						.button.is-success
							| {{Action}}
						.button.is-danger(v-on:click="addBuildingModal()") Cancel			

</template>
<script>
	export default{
		name: 'PSPortal',
		data(){
			return{
				car : require("@/assets/portal/car.png"),
				bike : require("@/assets/portal/motorbike.png"),
				selectedValue: 1,
				Tid:1,
				tenants : [],
				tenantLists: [],
				addBuildingModalCheck : false,
				Action: "Add"
			}
		},
		methods:{
			
			getLayout(i){
				this.carmap(this.tenants.SiteWise[i].TotalSpots.Car);
				this.bikemap(this.tenants.SiteWise[i].TotalSpots.Bike);
			},
			carmap(nmbr){
				var totalCar = nmbr;
				var col = 8;
				var count = 0;
				var row = Math.ceil(totalCar/col);
				var table = document.getElementById("park-map-car");
				//System.out.print(row);
				for(var i=1; i < row + 1; i++){
					var tr = table.insertRow(i);
					for(var j=0; j<col; j++){
							count++;
							if(count > totalCar){
								var td = tr.insertCell(j);
								td.setAttribute('id','car-td-'+i+"-"+j);
								//var ele1 = document.createElement('div');
								//ele1.classList.add("size");
								td.innerHTML="&nbsp;";
							}else {
								var td = tr.insertCell(j);
								td.setAttribute('id','car-td-'+i+"-"+j);
								var ele1 = document.createElement('div');
								ele1.setAttribute('id','car-im-'+i+"-"+j);
								document.getElementById("car-td-"+i+"-"+j).appendChild(ele1);
								//ele1.classList.add("sizem");
								
								ele1.classList.add("has-background-warning");
							
									

								var imge = document.createElement('img');
								imge.src = this.car;
								document.getElementById("car-im-"+i+"-"+j).appendChild(imge);
							}
					}
						//System.out.println();
				}
					
			},
			bikemap(nmbr){
				var totalbike = nmbr;
				var col = 8;
				var count = 0;
				var row = Math.ceil(totalbike/col);
				var table = document.getElementById("park-map-bike");
				//System.out.print(row);
				for(var i=1; i < row + 1; i++){
					var tr = table.insertRow(i);
					for(var j=0; j<col; j++){
						count++;
						if(count > totalbike){
							var td = tr.insertCell(j);
								td.setAttribute('id','bike-td-'+i+"-"+j);
								var ele1 = document.createElement('div');
								//ele1.classList.add("size");
								ele1.innerHTML="&nbsp;";
						}else {
							var td = tr.insertCell(j);
							td.setAttribute('id','bike-td-'+i+"-"+j);
							var ele1 = document.createElement('div');
							ele1.setAttribute('id','bike-im-'+i+"-"+j);
							document.getElementById("bike-td-"+i+"-"+j).appendChild(ele1);
							ele1.classList.add("has-background-warning");

							var imge = document.createElement('img');
							imge.src = this.bike;
							imge.style.width='50px';
							document.getElementById("bike-im-"+i+"-"+j).appendChild(imge)
						}
					}
					//System.out.println();
				}
				
			},
			async getTenantInfo(Tid){
				const res = await fetch(`https://maya.parkspot.in/inventory/tenant/${Tid}/details`);
				const data = await res.json();
				console.log(data);
				this.tenants = data;	
				},			
			async getTenantList(){
				const res = await fetch('https://maya.parkspot.in/inventory/entity/0/tenants');
				const data = await res.json();
				return data;
			},

			
		deleteBuilding(index){
			var table = document.getElementById("parking-site");
			table.deleteRow(index);
		},
		// addBuilding(lastindex){
		// 	var table = document.getElementById("parking-site");
		// 	var tr = table.insertRow(lastindex);
		// 	for(var i = 0; i < 4; i++){
		// 		var td = tr.insertCell(i);

		// 	}
		// }
		addBuildingModal(){
			this.addBuildingModalCheck = !this.addBuildingModalCheck;

		},
		EditBuildingModal(){
			this.addBuildingModalCheck = !this.addBuildingModalCheck;
			this.Action = "Edit"

		}		
		
		},
		async created(){
			this.tenantLists=await this.getTenantList();
			this.getTenantInfo(this.Tid);
		}

	}
</script>
<style scoped>
.no-space{

}
</style>
