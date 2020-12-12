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
                <button class="button is-warning" @click="handleLogin()" v-on:click.prevent="handleLogin()">Login</button>
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
		handleLogin: function(){
			fetch('http://168.63.243.20:5002/login', {
				method: 'POST',
				mode: 'cors',
				body: JSON.stringify({Username: this.loginUser, Password: this.loginPassword}),
				cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
				credentials: 'include', // include, *same-origin, omit
				
				headers: {
				  'Content-Type': 'application/json',
				  'Access-Control-Allow-Origin': '*'
				},
				redirect: 'follow', // manual, *follow, error
				referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
				    
			})
			.then((response)=>{
				console.log(response)
			})
			.catch((err)=>{
				console.log(err)
				this.$emit('close')
			})
		},
	}
}
</script>
