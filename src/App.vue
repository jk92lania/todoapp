<template>  
  <div class="container">    
    
    <h1>TODO LIST</h1>
    <!-- 할일 검색 입력창 -->
    <input v-model="searchText" type="text" class="form-control" placeholder="Search Todo list">
    <div class="red">{{ error }}</div>
    <hr />

    <!-- 할일 추가 입력창 -->
    <TodoSimpleForm v-on:add-todo="addTodo"/>
    

   
    <!-- 목록없음 안내창 -->
    <div v-if="!todos.length" class="red">생성된 Todo 목록이 없습니다.</div>

    <!-- todo 목룍창 -->
    <TodoList v-bind:todos="filteredTodo" v-on:toggle-todo="toggleTodo" v-on:delete-todo="deleteTodo"/>
    
  </div>  


</template>

<script>
import {computed, ref} from 'vue';
import axios from 'axios'

import TodoSimpleForm from './components/TodoSimpleForm.vue'
import TodoList from './components/TodoList.vue'

export default {
  components : {
    TodoSimpleForm,
    TodoList
  },

  setup(){    


    // 할일 목록(배열)을 저장
    const todos = ref([ ]);

    const error = ref('');

    // DB에서 자료 불러오기
    const getTodo = async () => {
      error.value = '';
      try {
        // 서버에서 자료 요청 진행 후 결과
        // res에서 받는다(response)
        const res = await axios.get("http://localhost:3000/todos");

        todos.value = res.data;

      } catch (err) {
        console.log(err);
        error.value = "자료를 불러오는데 실패했습니다.";
      }
    }
    getTodo();

    // TodoSimpleForm 에서  
      // add-todo 이벤트로 전달된 객체를 
      // 처리해 주는 콜백함수
     const addTodo = async (추가되는할일) => {

        error.value = '';
        try {
          // 데이터 베이스에 저장이 되어야 하는 데이터
          const res = await axios.post('http://localhost:3000/todos', {         
            subject: 추가되는할일.subject,
            complete: 추가되는할일.complete 
          });

          todos.value.push(res.data);

        }catch(err) {
          console.log(err);
          error.value = "서버 확인해 주세요.";
        }

      };

    const toggleTodo = async (index) => {
      // complete 를 업데이트
      const id = todos.value[index].id;
      error.value = '';
      try {
        // 서버 DB 업데이트
        await axios.patch('http://localhost:3000/todos/' + id, {
          complete : !todos.value[index].complete
        });
        // 웹브라우저의 todo 화면 표현
        todos.value[index].complete = !todos.value[index].complete;
        
      } catch(err) {
        console.log(err);
        error.value = "업데이트에 실패하였습니다.";
      }
      
    }
    
    const deleteTodo = async (index) => {
      // console.log('delete' + index);
      const id = todos.value[index].id;
      error.value = '';

      try {
        axios.delete('http://localhost:3000/todos/' + id);
        todos.value.splice(index, 1);
      } catch(err) {
        console.log(err);
        error.value = "삭제에 실패했습니다.";
      }
    }

    // 할일 검색 관련
    const searchText = ref('');

    // 검색에 따른 목록을 갱신해 주는 기능 생성
    const filteredTodo = computed(()=>{
      // 만약에 serchText와 동일한 todos 목록에 있는지를 검사
      // 화면 출력
      if(searchText.value) {
        return todos.value.filter((todoitem)=>{
          return todoitem.subject.includes(searchText.value);
        });

      }
      return todos.value;
    });


    return {
      todos,
      addTodo,
      toggleTodo,
      deleteTodo,

      searchText,
      filteredTodo,
      error
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
