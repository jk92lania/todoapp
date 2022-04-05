<template>
    <!-- html 태그 작성 장소 -->
    Todo 입력 폼
    <form action="" v-on:submit.prevent>
      <div class="d-flex">
        <div class="flex-grow-1 mr-2">
            <input 
            type="text" 
            placeholder="Type New Todo"
            class="form-control"
            v-model="todo"
            >
        </div>
        <div>
            <button class="btn btn-primary" type="submit" v-on:click="onSubmit">Add</button>
        </div>
      </div>
     <!-- 내용 입력 안내창 -->
  <div v-show="hasError" class="red">내용을 입력하세요</div>
    </form>



</template>
<script>
import {
    ref
    } from 'vue'
export default {
    
    emits : ['add-todo'],
    setup(props, {emit}) {
        
        const todo = ref('');
        // 내용 입력 안내창 여부
        const hasError = ref(false);

        // 버튼 클릭 시 처리 
        const onSubmit = () => {
            if(todo.value === '') {
                hasError.value = true;
            } else {
                // 안내창 숨기기
                hasError.value = false;
                // 할일의 내용을 배열로 추가한다
                // 이 때 상위 컴포넌트로 전달
                // context.emit('이벤트', {데이터});
                emit('add-todo', {
                    id : Date.now(),
                    subject : todo.value,
                    complete : false
                });

                // console.log(todo.value);
                // todos.value.push({
                //     id: Date.now(),
                //     subject : todo.value,
                //     complete : false
                // });
            }
            todo.value = '';
        }

        return {
            todo,
            hasError,
            onSubmit
        }
    }
}
</script>
<style>
/* css 작성장소 */
</style>