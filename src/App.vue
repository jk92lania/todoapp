<template>
<div class="red">
 {{ 이름 }} {{ 나이 }}
</div>
 <!-- {{ 안녕() }} -->
 <!-- {{ 이름말해봐('iU')}} -->
 <!-- {{ greeting }} -->
 {{ 정보.이름 }} {{정보.나이 }}
 <button v-on:click="log" class="btn btn-primary mt-2">logclick</button>
 <button v-on:click="updateInfo" class="btn btn-primary mt-2">click</button>
 <button v-on:click="updateAge" class="btn btn-primary mt-2 ml-2">click</button>
  <input type="text" v-model="이름">

  <div class="container">
    <h1>TODO LIST</h1>
    <form action="" class="d-flex" v-on:submit.prevent>
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
    </form>
  <div v-show="hasError" class="red">내용을 입력하세요</div>
  <div 
  class="card mt-2" 
  v-for="(todo, index) in todos"
  v-bind:key ="todo.id"
  >
    <div class="car-body p-2 d-flex">
      <div class="form-check flex-grow-1">
        <input 
        type="checkbox" 
        class="from-check-input" 
        v-model="todo.complete"
        v-bind:id="todo.id"
        >
        <!-- <label class="form-check-label" v-bind:style="todo.complete ? todoStyle : {}">{{ todo.subject }}</label> -->
        <label 
        class="form-check-label" 
        v-bind:class="{todocss : todo.complete}"
        v-bind:for="todo.id"
        >
        {{ todo.subject }}
        </label>
      </div>
      <!-- 삭제버튼 -->
      <div>
        <button class="btn btn-danger btn-sm" @click="deleteTodo(index)">Delete</button>
      </div>
    </div>
  </div>
  </div>
  <div v-show="toggle">true</div>
  <div v-show="!toggle">false</div>
  <button v-on:click="toggleFn">toggle</button>


  


</template>

<script>
import {ref, reactive} from 'vue';
export default {
  setup(){
    // const 이름 = '홍길동';
    // const 나이 = 20;
    // const 안녕 = function(){
    //   return '반가워요';
    // }
    // const 이름말해봐 = function(_name){
    //   return _name + '는 인사했습니다';
    // }
    // const greeting = 이름말해봐(이름);
    
    const 이름 = ref('홍길동');
    const 나이 = ref(20);
    const 정보 = reactive({
      이름 : '춘향',
      나이 : '13'
    });
    const log = () => {
      console.log(이름.value);
    }
    const updateName = (event) => {
      console.log(event.target.value);
      이름.value = event.target.value;
    }
    const updateAge = () => {
      나이.value = 30;
    }
    const updateInfo = () => {
      정보.이름 = '향단이';
    }

    const todos = ref([
      {id : 1, subject: '할일 1', complete:false },
      {id : 2, subject: '할일 2', complete:false },
      {id : 3, subject: '할일 3', complete:true },
      {id : 4, subject: '할일 4', complete:false }
    ]);
    const todo = ref('');
    const todoStyle = {
      textDecoration: 'line-through',
      color: 'gray'
    }
    const onSubmit = () => {
      if(todo.value === '') {
        hasError.value = true;
      } else {
        // 안내창 안내
        hasError.value = false;
      console.log(todo.value);
      todos.value.push({
        id: Date.now(),
        subject : todo.value,
        complete : false
      });
      }
    }
    const hasError = ref(false);
    
    const toggle = ref(false);
    const toggleFn = () => {
      toggle.value = !toggle.value;
    }
    const deleteTodo = (index) => {
      console.log('delete' + index);
      todos.value.splice(index, 1);
    }


    return {
      이름,
      나이,
      // 안녕,
      // 이름말해봐,
      // greeting,
      log,
      updateName,
      정보,
      updateAge,
      updateInfo,
      todos,
      todo,
      onSubmit,
      toggle,
      toggleFn,
      hasError,
      todoStyle,
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
