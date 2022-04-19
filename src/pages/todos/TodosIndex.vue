<template>  


  <div class="container"> 

    <!-- 타이틀 -->
    <div class="d-flex justify-content-between mt-3 mb-3">
      <AppTitle :apptitle="apptext" />
      <button class="btn btn-primary btn-sm" @click="moveToCreate">할일 등록</button>
    </div>
    
    <!-- 할일 검색 입력창 -->
    <input v-model="searchText" type="text" class="form-control" placeholder="Search Todo list" @keyup.enter="searchTodo">
    <ErrorBox :errtext="error" />
  
    <hr />

    <!-- 할일 추가 입력창 -->
    <!-- <TodoSimpleForm @add-todo="addTodo"/> -->
    

   
    <!-- 목록없음 안내창 -->
    <div v-if="!todos.length" class="red">생성된 Todo 목록이 없습니다.</div>

    <!-- todo 목룍창 -->
    <TodoList :todos="todos" @toggle-todo="toggleTodo" @delete-todo="deleteTodo"/>
    

    <!-- pagination -->
    <AppPagination :currentPage="nowPage" :allPage="numberOfPages" @page-show="getTodo"/>

  </div>  


</template>

<script>
import {computed, ref, watch } from 'vue';
// import axios from 'axios'
import axios from '@/axios.js'

// import TodoSimpleForm from '@/components/TodoSimpleForm.vue'
import TodoList from '@/components/TodoList.vue'
import AppTitle from '@/components/AppTitle.vue'
import ErrorBox from '@/components/ErrorBox.vue'
import AppPagination from '@/components/AppPagination.vue'

import { useToast } from '@/composables/toast.js';
import { useRouter } from 'vue-router';



export default {
  components : {
    // TodoSimpleForm,
    TodoList,
    AppTitle,
    ErrorBox,
    AppPagination
  },

  setup(){   
    
    // 할일 생성 페이지로 이동
      const router = useRouter();
      const moveToCreate = () => {
        router.push({
          name: 'TodoCreate'
        });
      };


    // title
    const apptext = ref('오늘 할 일'); 


    // 할일 목록(배열)을 저장
    const todos = ref([]);

    const error = ref('');

    // 페이지네이션
    // 전체 todos 개수가 필요
    const totalTodos = ref(0);
    // 한 화면당 보여줄 todo
    const limit = 5;
    // 현재 보여주는 펴이지 번호
    const nowPage = ref(1);
    // 총페이지 숫자
    const numberOfPages = computed( () => {
      return Math.ceil(totalTodos.value / limit);
    });
   

    // toastbox 관련
    const {
        showToast,
        toastMessage,
        triggerToast,
        toastAlertType
    } = useToast();
      


    // 할일 검색 관련
    const searchText = ref('');
    let timeout = null;

    // enter키 입력시
    const searchTodo = () => {
      clearTimeout(timeout);
      getTodo(1);
    }

    watch(searchText, () => {

      clearTimeout(timeout);
      setTimeout(()=> {
        getTodo(1)

      }, 2000);
    });
    
    // DB에서 자료 불러오기
    const getTodo = async (page = nowPage.value) => {
      error.value = '';
      nowPage.value = page;
      try {
        // 서버에서 자료 요청 진행 후 결과
        // res에서 받는다(response)
        const res = await axios.get(`todos?subject_like=${searchText.value}&_page=${page}&_limit=${limit}&_sort=id&_order=desc`);

        // console.log(res.headers);
        totalTodos.value = res.headers["x-total-count"];
        if(nowPage.value > numberOfPages.value) {
          getTodo(nowPage.value - 1);
          return
        }


        todos.value = res.data;
        // 전달된 값을 page로 받아들임

      } catch (err) {
        console.log(err);
        error.value = "자료를 불러오는데 실패했습니다.";
         triggerToast('자료를 불러오는데 실패했습니다. ', 'danger');
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
          await axios.post('todos', {         
            subject: 추가되는할일.subject,
            complete: 추가되는할일.complete 
          });
          getTodo(1);

        }catch(err) {
          console.log(err);
          error.value = "서버 확인해 주세요.";
         triggerToast('서버 확인해 주세요. ', 'danger');
        }

      };

    const toggleTodo = async (index, checked) => {
      // complete 를 업데이트
      const id = todos.value[index].id;
      error.value = '';
      try {
        // 서버 DB 업데이트
        await axios.patch('todos/' + id, {
          complete : checked
        });
        // 웹브라우저의 todo 화면 표현
        todos.value[index].complete = checked;
        triggerToast('상태를 변경하였습니다. ', 'success');
        
      } catch(err) {
        console.log(err);
        error.value = "업데이트에 실패하였습니다.";
         triggerToast('업데이트에 실패하였습니다. ', 'danger');
      }
      
    }
    
    const deleteTodo = async (index) => {    
      const id = index;
      error.value = '';

      try {
        console.log(id);
        await axios.delete('todos/' + id);
        triggerToast("목록을 삭제하였습니다.", 'success');
        getTodo();
      } catch(err) {
        console.log(err);
        error.value = "삭제에 실패했습니다.";
        triggerToast("삭제에 실패했습니다.", 'danger');
      }
    }


    

    return {
      apptext,

      todos,
      addTodo,
      toggleTodo,
      deleteTodo,

      searchText,
      searchTodo,
      error,

      totalTodos,
      nowPage,
      numberOfPages,
      getTodo,

      
        showToast,
        toastMessage,
        triggerToast,
        toastAlertType, 

        moveToCreate

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
