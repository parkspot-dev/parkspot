<template>
    <textarea  cols="30" rows="5" :placeholder="placeholder"></textarea>
</template>

<script>
export default {
    name:'atom-textarea',
    props:{
        placeholder:{
            type:String,
            default(){
                return "";
            }
        }
    }
}
</script>