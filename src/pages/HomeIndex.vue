<template>
    <h1>Home page</h1>
    {{count}}
    <button @click="count++">증가</button>
</template>
<script>
import {useCount} from '@/composables/count.js'
export default {
    setup() {
        const {count} = useCount();
        return {
            count
        }
    }
}
</script>
<style>
</style>