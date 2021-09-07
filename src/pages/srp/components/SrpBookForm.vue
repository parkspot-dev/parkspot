<template>
 <form action="" @submit="onSubmit">
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
            <input v-model="name" class="input" type="text" placeholder="John Doe" required/>
          </div>
        </div>

        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input v-model="email"
              class="input"
              type="email"
              placeholder="abc@example.com"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Mobile No.</label>
          <div class="control">
            <input v-model="mno" class="input" type="tel" placeholder="+91 XXX XXX XXXX"  required/>
          </div>
        </div>

        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" required/>
              I agree to the <router-link target="_blank" :to="{ name: 'Terms' }"> TERMS AND CONDITIONS</router-link>
            </label>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success">Submit</button>
        <button v-on:click="onCancel" class="button">Cancel</button>
      </footer>
    </div>
  </div>
 </form>
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
    onSubmit(e){
        e.preventDefault();
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