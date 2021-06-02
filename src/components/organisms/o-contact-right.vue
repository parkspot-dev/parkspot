<template>
  <div class="o_contact_right">
    <atom-input class="input mb-2" :types="text" :placeholder="placeholder1" />
    <atom-input class="input mb-2" :types="email" :placeholder="placeholder2" />
    <atom-input class="input mb-2" :types="tel" :placeholder="placeholder3" />
    <atom-textarea class="textarea mb-2" :placeholder="placeholder4" />
    <atom-button class="button is-warning is-pulled-right" :text="submit"/>
  </div>
</template>

<script>
import AtomButton from '@/components/atoms/atom-button/atom-button.vue';
import atomInput from "@/components/atoms/atom-input/atom-input.vue";
import AtomTextarea from "@/components/atoms/atom-input/atom-textarea.vue";
export default {
  components: { atomInput, AtomTextarea, AtomButton },
  name: "o-contact-right",
  data(){
      return{
          text:"text",
          email:"email",
          tel:"tel",
          placeholder1:"Name",
          placeholder2:"Email",
          placeholder3:"Mobile No.",
          placeholder4:"Your Questions...",
          submit:"Submit"
      }
  }
};
</script>