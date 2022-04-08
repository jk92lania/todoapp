<template>
    <div class="red">{{ errtext }}</div>
</template>
<script>
export default {
    props : {
        errtext : {
            type : String,
            required : true
        }
    }
}
</script>
<style>

</style>