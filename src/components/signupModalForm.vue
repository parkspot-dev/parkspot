<template>
	<form action="">
        <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
                <p class="modal-card-title">Sign Up</p>
                <button
                    type="button"
                    class="delete"
                    @click="$emit('close')"/>
            </header>
            <section class="modal-card-body">

                <b-field label="Username"
						:type="{ 'is-danger': hasError }"
						:message="{ 'required field': hasError }"
				>				
                    <b-input
						v-model="signupUser"
                        :value="signupUser"
                        placeholder="Your Username"
                        required>
                    </b-input>
                </b-field>

                <b-field label="Password"
						:type="{ 'required field': hasError }"
				>
					<b-input
	  					v-model="signupPassword"
                        type="password"
                        :value="signupPassword"
                        password-reveal
                        placeholder="Your password"
                        required>
                    </b-input>
                </b-field>



                <b-field label="Fullname"
						:type="{ 'is-danger': hasError }"
						:message="{ 'required field': hasError }"
				>				
                    <b-input
						v-model="signupFullName"
                        :value="signupFullName"
                        placeholder="Your Fullname"
                        required>
                    </b-input>
                </b-field>


                <b-field label="City"
						:type="{ 'is-danger': hasError }"
						:message="{ 'required field': hasError }"
				>				
                    <b-input
						v-model="signupCity"
                        :value="signupCity"
                        placeholder="Your City"
                        required>
                    </b-input>
                </b-field>


                <b-field label="Vehicle Number"
						:type="{ 'is-danger': hasError }"
						:message="{ 'required field': hasError }"
				>				
                    <b-input
						v-model="signupVNO"
                        :value="signupVNO"
                        placeholder="Your Vehicle Number"
                        required>
                    </b-input>
                </b-field>



                <b-field label="Email"
						:type="{ 'is-danger': hasError }"
						:message="{ 'required field': hasError }"
				>				
                    <b-input
						v-model="signupEmail"
                        :value="signupEmail"
                        placeholder="Your Email ID"
                        required>
                    </b-input>
                </b-field>


                <b-field label="Mobile"
						:type="{ 'is-danger': hasError }"
						:message="{ 'required field': hasError }"
				>				
                    <b-input
						v-model="signupMobile"
                        :value="signupMobile"
                        placeholder="Your Phone Number"
                        required>
                    </b-input>
                </b-field>

            </section>
            <footer class="modal-card-foot">
				<div class="center" v-if="isLoading">
                	<button class="button" type="button" @click="$emit('close')">Close</button>
                	<button class="button is-warning" @click="signup()" v-on:click.prevent="signup()">Signup</button>
									<div class="lds-dual-ring"></div>
				</div>
				<div v-else>
                	<button class="button" type="button" @click="$emit('close')">Close</button>
                	<button class="button is-warning" @click="signup()" v-on:click.prevent="signup()">Signup</button>
				</div>

                <button class="button" type="button" @click="$emit('close')">Close</button>
            </footer>
        </div>
    </form>
</template>
<script>
export default{
	name: "loginModalForm",
	data(){
		return {
			signupPassword: "",
			signupUser: "",
			signupVNO: "",
			signupEmail: "",
			signupMobile: "",
			signupCity: "",
			signupFullName: "",
			isLoading: false,
			hasError: false
		}
	},
	methods: {
		postData: async function(url = '', data = {}) {
						  // Default options are marked with *
						  this.isLoading = true
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
		signup: async function(){
			try{
				var resp = await this.postData("https://maya.parkspot.in/auth/register", {User: this.signupUser, Password: this.signupPassword, VehicleNumber: this.signupVNO, EmailID: this.signupEmail, Mobile: this.signupMobile, City: this.signupCity, FullName: this.signupFullName})
			if(resp.status === true){
				this.Loading = false
				this.hasError = false
				this.$emit("close")
				this.$emit("loggedIn")
			}
			else{
				this.Loading = false
				this.hasError = true
			}
		}
		catch(e){
			this.Loading = false
			this.hasError = true
		}
	},
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

