<template lang="pug">
	.hero.is-fullheight.is-dark#book
		.hero-body
			.columns.is-vcentered.is-centered
				.column.is-one-quarter
					p.title
						| Our best picks
				.column.is-one-quarter
					.card.team
						.card-image
							figure.image.is-4by3
								img(:src="`${kolkata}`")
						.card-content
							.media
								.media-content
									p.title.is-4.has-text-black Kolkata
									p.subtitle.is-6.has-text-black @Ballygunge
							.content
								| 129, KN Sen Rd, 
								| New Ballygunge, 
								| Kasba, Kolkata, 
								| West Bengal 700042
						.card-footer
							.card-footer-item
								a.button.is-dark(href="#contact" id="Kolkata") Book
				.column.is-one-quarter
					.card.team
						.card-image
							figure.image.is-4by3
								img(:src="`${chennai}`")
						.card-content
							.media
								.media-content
									p.title.is-4.has-text-black Chennai
									p.subtitle.is-6.has-text-black @Pallikaranai
							.content
								| Apartment name: Newry Shanmitha, 
								| 1st floor, 1b- 105, Block 1, 
								| Bharathiyar salai, 
								| Pallikaranai Chennai -600100
						.card-footer
							.card-footer-item
								a.button.is-dark(href="#contact" id="Chennai") Book
				.column.is-one-quarter
					.card.team
						.card-image
							figure.image.is-4by3
								img(:src="`${bangalore}`")
						.card-content
							.media
								.media-content
									p.title.is-4.has-text-black Bangalore
									p.subtitle.is-6.has-text-black @RTNagar
							.content
								| Hani elegance RT Nagar
						.card-footer
							.card-footer-item
								a.button.is-dark(href="#contact" id="Bangalore") Book

</template>
<script>
function setOptionUser(){
	document.getElementById("options").selectedIndex = 1
}
function setOptionOperator(){
	document.getElementById("options").selectedIndex = 0
}
$("#Bangalore").click(function(){
	console.log("namma bangaluru")
	$("#cityc").val("Bangalore")
	$("#messagec").val("Booking for BAN_RTNAGAR#1")
})
$("#Kolkata").click(function(){
		console.log("namoskar howrah")
		$("#cityc").val("Kolkata")
		$("#messagec").val("Booking for KOL_BALLY#1")
})
$("#Chennai").click(function(){
	console.log("vannakam chennai")
	$("#cityc").val("Chennai")
	$("#messagec").val("Booking for CHE_PALLI#1")
})
function postPewPew(){
	//var url = "http://168.63.243.20:5002/contact" //"http://localhost:8080"
	var payload = {
		name: $("#namec").val(),
		email: $("#emailc").val(),
		city: $("#cityc").val(),
		atype: $("#options").val(),
		message: $("#messagec").val()					
	}
	var valid = true
	for(i in payload){
		if(payload[i] === ""){
			valid = false
			var target = "#"+i+"c"
			$(target).addClass("animate__animated animate__shakeX is-danger")
			window.setTimeout(function(target){
				$(target).removeClass("animate__animated animate__shakeX is-danger")
			},2000, target)	
		}
	}
	if(!valid){
		return false
	}
	//alert("rowdy baby")
	//console.log("trapdoor")
	//fetch(url, {
	//	method: "POST",
	//	mode: "cors",
	//	body: JSON.stringify(payload)
	//}).then((data)=>{
	//	window.location.replace("https://www.parkspot.in/thanks")
	//	//console.log("done", data)
	//})
	window.location.replace("https://www.parkspot.in")
}
$("#formsubmit").click(postPewPew)
$("rent").click(setOptionOperator)
$("formsubmit").click(postPewPew)





export default{
	name: "PSSites",
	data (){
		return {
			bangalore: require("../assets/psites/bang.jpeg"),
			chennai: require("../assets/psites/ch.jpeg"),
			kolkata: require("../assets/psites/kol.jpeg")
		}
	}
}
</script>
<style>
</style>
