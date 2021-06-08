<template>
    <h1>{{text}}</h1>
</template>

<script>
export default {
    name:"atom-b-title",
    props:{
        text:{
            type:String,
            default(){
                return "Title"
            }
        }
    }

}
</script>