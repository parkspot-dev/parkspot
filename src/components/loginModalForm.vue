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
                <b-field label="Username"
						:type="{ 'is-danger': hasError }"
						:message="{ 'invalid username or password': hasError }"
				>				
                    <b-input
						v-model="loginUser"
                        :value="loginUser"
                        placeholder="Your Username"
                        required>
                    </b-input>
                </b-field>

                <b-field label="Password"
						:type="{ 'is-danger': hasError }"
				>
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
				<div class="center" v-if="isLoading">
                	<button class="button" type="button" @click="$emit('close')">Close</button>
                	<button class="button is-warning" @click="getAccessToken()" v-on:click.prevent="getAccessToken()">Login</button>
					<div class="lds-dual-ring"></div>
				</div>
				<div v-else>
                	<button class="button" type="button" @click="$emit('close')">Close</button>
                	<button class="button is-warning" @click="getAccessToken()" v-on:click.prevent="getAccessToken()">Login</button>
				</div>
            </footer>
        </div>
    </form>
</template>
<script>
export default{
	name: "loginModalForm",
	data(){
		return {
			loginPassword: "",
			loginUser: "",
			isLoading: false,
			hasError: false
		}
	},
	methods: {
		postData: async function(url = '', data = {}) {
						  // Default options are marked with *
						  this.isLoading = true
						  console.log(this.loginUser, this.loginPassword)
						  const response = await fetch(url, {
													headers: {
      														'Accept': 'application/json',
      														'Content-Type': 'application/json'
    											},
								  		    method: 'POST', // *GET, POST, PUT, DELETE, etc.
								  		    mode: 'cors', // no-cors, *cors, same-origin
								  		    body: JSON.stringify(data) // body data type must match "Content-Type" header
								  		  });
						  return response.json(); // parses JSON response into native JavaScript objects
						},
		getAccessToken: async function(){
			try{
				var resp = await this.postData('https://maya.parkspot.in/auth/login', { Username: this.loginUser, Password: this.loginPassword})
				var token = resp.token || ""
				console.log("warning check", this.hasError)
				console.log(this.loginUser, this.loginPassword)
				if(localStorage !== undefined){
					if(token !== ""){
						this.hasError = false
						this.isLoading = false
						localStorage.setItem("PSToken", token)
						this.$emit("loggedInEvent") //loggedInEvent
						this.$emit("close")
					}
					else{
						//insert here headshake animate css #wrong password
						this.hasError = true
						this.isLoading = false
						console.log("Invalid token")
					}
				}
				else{
					this.isLoading = false
					console.log("localStorage access is not available")
				}
			}
			catch(e){
				this.hasError = true
				console.log("error blah pew",e)
				this.isLoading = false
			}


		}
	}
}
</script>
<style>
.lds-dual-ring {
  display: inline-block;
  width: 40px;
  height: 40px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 70%;
  height: 70%;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid hsl(48, 100%, 67%);
  border-color: hsl(48, 100%, 67%) black hsl(48, 100%, 67%) black;
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
.center{
	margin: auto;
}
</style>

