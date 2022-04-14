<template>    

    <div v-if="loading">Loading...</div>

    <form v-else @submit.prevent="onSave">

        <div class="row">
            
            <!-- 제목 수정 및 입력 창 -->
            <div class="col-6">
                <div class="form-group">
                    <label>제목</label>
                    <input type="text" class="form-control" v-model="todo.subject">
                    <div v-if="subjectError" class="red-text bold-text">{{ subjectError }}</div>
                </div>

            </div>

            <!-- 상태 수정 창 -->
            <div class="col-6" v-if="editing">
                <div class="form-group">                    
                    <label>완료여부</label>   
                    <div>
                        <button 
                            class="btn"
                            :class="todo.complete ? 'btn-success' : 'btn-danger' "
                            @click="toggleTodoState"
                            type="button"
                        >
                            {{ todo.complete ? 'Complete' : 'Incomplete' }}

                        </button>
                    </div>
                </div>
            </div>

            <!-- 본문내용 입력 및 수정 창 -->
            <div class="col-12">
                <div class="form-group">
                    <label for="">본문</label>
                    <textarea class="form-control" cols="30" rows="10" v-model="todo.body"></textarea>
                </div>
            </div>
        </div>        

        <button class="btn btn-primary" type="submit" :disabled="todoUpdate">저장</button>        
        <button class="btn btn-outline-dark ml-2" @click="moveBack" type="button">취소</button>

    </form>

    <!-- 안내창 -->
    <Transition name="fade">
        <ToastBox v-if="showToast" :message="toastMessage" :type="toastAlertType"/>

    </Transition>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import {computed, ref} from 'vue';
import _ from 'lodash';

import ToastBox from '@/components/ToastBox.vue';
import { useToast } from '@/composables/toast.js';


export default {
    components : {
        ToastBox
    },
    props : {
        editing : {
            type : Boolean,
            default : false
        }
    },
    emits : ['update-todo', 'new-todo'],

    setup(props, {emit}) {
        
       const route = useRoute();
        const router = useRouter();


       // 현재 진행 및 수정 중인 todo 정보를 저장하고 있는 객체
        const todo =  ref({
            subject: '',
            complete: false,
            body : ''
        });



        // 원래 가지고 있었던 todo 저장를 저장하고 있는 객체
        const originalTodo = ref(null);
        
        const loading = ref(false);
        // id는 읽어올때 사용, 저장할 때 사용
        const todoId = route.params.id;
        
        // toastBox 관련
        const {
            showToast,
            toastMessage,
            triggerToast,
            toastAlertType

        } = useToast();    


        const getTodo = async () => {
            // 내용 가져올 때 로딩
            loading.value = true;
            try {
                const res = await axios.get(`http://localhost:3000/todos/${todoId}`);            
                todo.value = {...res.data }; // spread 연산으로 내용물 만 복사
                originalTodo.value = { ...res.data }; // spread 연산으로 내용물 만 복사
                
                // 결과 나올시
                loading.value = false;
            }catch(error){
                console.log(error);
                triggerToast('서버에서 자료를 가지고 오는데 실패하였습니다. ', 'danger');
                
                // 결과 나올시
                loading.value = false;
            }
        }   

        // todo 객체와 originalTodo를 비교
        // 객체를 비교한느 것이 아닌
        // 객체 안 요소의 값을 비교, 같은가? 다른 가?
        // 늘 비교
        const todoUpdate = computed(()=>{
            return _.isEqual(todo.value, originalTodo.value)
        });

        // 편집이라면 아래 구문을 실행
        if(props.editing) {
            getTodo();

        }


        const toggleTodoState = () => {
            todo.value.complete = !todo.value.complete
        }

        const moveBack = () => {
            // router 개체에 Push 하면 
            // 화면 이동이 된다.
            // 이때 화면 이동의 장소 정보는
            // router 폴더의 index.js 아래에 기재 되어 있다.
            // 아래의 경우는 다음과 같이 기재가 되어 있다.
            // {
            //     path: '/todos',
            //     name: 'Todos',
            //     component: TodosIndex
            // },
            // name 을 통해서 이동을 하므로 
            // 최종적으로 /todos 로 이동을 한다.
            router.push({
                name : 'Todos'
            });
        }

        const subjectError = ref('');

        const onSave = async () => {
            // 제목 없으면 등록 및 편집 불가
            if(!todo.value.subject) {
                subjectError.value = '제목을 입력하세요';
                triggerToast('제목을 입력해 주세요.', 'danger');
                return;
            }

            
            try {
                let res;
               const data = {
                   subject: todo.value.subject,
                   complete: todo.value.complete,
                   body: todo.value.body
               }

                if(props.editing) {
                    // 편집 시
                    res = await axios.put(`http://localhost:3000/todos/${todoId}`, data);
                    // console.log(res);
                    originalTodo.value = {...res.data};
                    emit('update-todo', {});
                    triggerToast('데이터 업데이트에 성공하였습니다.', 'success');

                } else {
                    // 신규 등록 시
                    res = await axios.post(`http://localhost:3000/todos`, data);
                    emit('new-todo', {});
                    triggerToast('데이터 저장에 성공하였습니다.', 'success');
                }

                todo.value.subject = '';
                    todo.value.body = '';
                    // 목록으로 돌아간다.
                    router.push({
                         name: 'Todos'
                    });


            }catch(error) {
                console.log(error);
                 if(props.editing) {
                    triggerToast("데이터 업데이트에 실패하였습니다.", 'danger');
                    } else {
                    triggerToast("데이터 저장에 실패하였습니다.", 'danger');

                }
            }   
        }

        return {
            todo,
            loading,
            toggleTodoState,
            moveBack,
            onSave,
            todoUpdate,

            showToast,
            toastMessage,
            toastAlertType,
            triggerToast,

            subjectError
        }
    }
}
</script>
<style>
    .red-text {
        color: red;
    }
</style>
<style scoped>
    .bold-text {
        font-weight: 900;
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
    .fade-enter-to,
    .fade-leave-from {
        opacity: 1;
    }
</style>