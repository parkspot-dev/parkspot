<template>
    <p>{{text}}</p>
</template>

<script>
export default {
    name:"atom-b-subtitle",
    props:{
        text:{
            type:String,
            default(){
                return "SubTitle"
            }
        }
    }

}
</script>