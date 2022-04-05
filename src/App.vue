<template>
  <div class="container">    
    <h1>TODO LIST</h1>
    <!-- 할일 추가 입력창 -->
    <TodoSimpleForm v-on:add-todo="addTodo"/>
    

   
    <!-- 목록없음 안내창 -->
    <div v-if="!todos.length" class="red">생성된 Todo 목록이 없습니다.</div>

    <!-- todo 목룍창 -->
    <TodoList v-bind:todos="todos" v-on:toggle-todo="toggleTodo" v-on:delete-todo="deleteTodo"/>
    
  </div>  


</template>

<script>
import {ref} from 'vue';
import TodoSimpleForm from './components/TodoSimpleForm.vue'
import TodoList from './components/TodoList.vue'

export default {
  components : {
    TodoSimpleForm,
    TodoList
  },

  setup(){    

    // 할일 목록(배열)을 저장
      const todos = ref([
        {id:1, subject:'할일', completed: false}
      ]);

    const todoStyle = {
      textDecoration: 'line-through',
      color: 'gray'
    }

    // TodoSimpleForm 에서  
      // add-todo 이벤트로 전달된 객체를 
      // 처리해 주는 콜백함수
    const addTodo = (todo) => {
      todos.value.push(todo);
    }

    const toggleTodo = (index) => {
      todos.value[index].completed != todos.value[index].completed;
    }
    
    const deleteTodo = (index) => {
      // console.log('delete' + index);
      todos.value.splice(index, 1);
    }


    return {
      todos,
      todoStyle,
      addTodo,
      toggleTodo,
      deleteTodo
    }
  }
}
</script>

<style>
.red {
   color: red;
}
.todocss {
  text-decoration: line-through;
  color: #333;
}
</style>
