<template>
    <input :types="text" :placeholder="placeholder">
</template>

<script>
export default {
    name:"atom-input",
    props:{
        types:{
            type:String,
            default(){
                return "text"
            }
        },
        placeholder:{
            type:String,
            default(){
                return ""
            }
        }
    }
}
</script>