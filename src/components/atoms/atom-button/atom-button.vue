<template>
    <button>{{text}}</button>
</template>

<script>
export default {
    name:'atom-button',
    props:{
        text:{
        type:String,
        default(){
            return "Button"
        }}
    }
}
</script>