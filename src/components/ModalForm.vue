<template>
	<form action="">
        <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
                <p class="modal-card-title">Login</p>
                <button
                    type="button"
                    class="delete"
                    @click="$emit('close')"/>
            </header>
            <section class="modal-card-body">
                <b-field label="Username">
                    <b-input
						v-model="loginUser"
                        :value="loginUser"
                        placeholder="Your Username"
                        required>
                    </b-input>
                </b-field>

                <b-field label="Password">
                    <b-input
						v-model="loginPassword"
                        type="password"
                        :value="loginPassword"
                        password-reveal
                        placeholder="Your password"
                        required>
                    </b-input>
                </b-field>

                <b-checkbox>Remember me</b-checkbox>
            </section>
            <footer class="modal-card-foot">
                <button class="button" type="button" @click="$emit('close')">Close</button>
                <button class="button is-warning" @click="getAccessToken()" v-on:click.prevent="getAccessToken()">Login</button>
				<div v-if="isLoading" class="lds-dual-ring"></div>
            </footer>
        </div>
    </form>
</template>
<script>
export default{
	name: "ModalForm",
	data(){
		return {
			loginPassword: "",
			loginUser: "",
			isLoading: false
		}
	},
	methods: {
		postData: async function(url = '', data = {}) {
		  // Default options are marked with *
		  this.Loading = true
		  const response = await fetch(url, {
		    method: 'POST', // *GET, POST, PUT, DELETE, etc.
		    mode: 'cors', // no-cors, *cors, same-origin
		    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		    credentials: 'same-origin', // include, *same-origin, omit
		    headers: {
		      'Content-Type': 'application/json'
		    },
		    redirect: 'follow', // manual, *follow, error
		    referrerPolicy: 'origin', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		    body: JSON.stringify(data) // body data type must match "Content-Type" header
		  });
		  return response.json(); // parses JSON response into native JavaScript objects
		},
		getAccessToken: async function(){
			var resp = await this.postData('https://cors-anywhere.herokuapp.com/'+'http://168.63.243.20:5002/auth/login', { Username: "sud", Password: "ambastha@1"})
			var status = resp.status
			var token = resp.token || ""
			if(localStorage !== undefined){
				if(token !== ""){
					this.isLoading = false
					localStorage.setItem("PSToken", token)
					this.$emit("loggedInEvent") //loggedInEvent
					this.$emit("close")
				}
				else{
					//insert here headshake animate css #wrong password
					console.log("Invalid token")
				}
			}
			else{
				console.log("localStorage access is not available")
			}
			this.isLoading = false
		}
	}
}
</script>
<style>
.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 70%;
  height: 70%;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid hsl(48, 100%, 67%);
  border-color: hsl(48, 100%, 67%) transparent hsl(48, 100%, 67%) transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

