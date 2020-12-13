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
                <button class="button is-warning" @click="getAccessToken()" v-on:click.prevent="handleLogin()">Login</button>
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
			loginUser: ""
		}
	},
	methods: {
		postData: async function(url = '', data = {}) {
		  // Default options are marked with *
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
			var resp = await utils.postData('https://cors-anywhere.herokuapp.com/'+'http://168.63.243.20:5002/auth/login', { Username: "sud", Password: "ambastha@1"})
			var status = resp.status
			var token = resp.token || ""
			console.log("received token",token)
			return token
		}
	}
}
</script>
