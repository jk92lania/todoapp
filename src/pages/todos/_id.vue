<template>    
    <h1>TODO 수정</h1>
    <TodoForm :editing="true"/>
    
</template>

<script>
import TodoForm from '@/components/TodoForm.vue'

export default {
    components : {
        TodoForm
    },
    setup() {
        return {
        }
    }
}
</script>
<style>

</style>