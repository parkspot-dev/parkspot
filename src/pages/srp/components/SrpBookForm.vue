<template>
  <div :class="[showBookForm ? 'is-active':'','modal' ]">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Booking</p>
        <button v-on:click="onCancel" class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <!-- Content ... -->
        <div class="field">
          <label class="label">Name</label>
          <div class="control">
            <input v-model="name" class="input" type="text" placeholder="John Doe" />
          </div>
        </div>

        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input v-model="email"
              class="input is-danger"
              type="email"
              placeholder="abc@example.com"
            />
          </div>
          <p class="help is-danger">This email is invalid</p>
        </div>

        <div class="field">
          <label class="label">Mobile No.</label>
          <div class="control">
            <input class="input" type="tel" placeholder="+91 XXX XXX XXXX" />
          </div>
        </div>

        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" />
              I agree to the <a href="#">terms and conditions</a>
            </label>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button v-on:click="onSubmit" class="button is-success">Submit</button>
        <button v-on:click="onCancel" class="button">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "SrpBookForm",
  data(){
      return{
          name:"",
          email:"",
          mno:"",
      }
  },
  props:{
      showBookForm:Boolean,
      index:String
  },
methods:{
    onSubmit(){
        
        console.log("submit");
        const newBook = {
            ID:this.index,
            name:this.name,
            email:this.email,
            mno:this.mno

        }
        // console.log(newBook)

        this.$emit("on-submit",newBook)
        
        this.name="";
        this.email="";
        this.mno="";
    },
    onCancel(){
        this.$emit("on-cancel")
    }

}
};
</script>