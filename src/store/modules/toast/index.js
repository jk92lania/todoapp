export default {
    // 분류후 접근시 구분하려는 경우는 namespaced true 셋팅
     // 별도의 state, muation. actions, getter 작성
    namespaced : true,
    
    // vuex에 데이터 변수 설정, 변경 불가
    state : {
        // 메시지 및 타입 목록
        toasts : [
            // {message : 'hello', type: 'danger'},
        ],
        showToast : false
    },
    mutations : {
        // 메시지 추가
        // payload {message : 'hello', type: 'danger'},
        ADD_TOAST(state, payload){
            state.toasts.push(payload);
        },
        
        // 메시지 제거
        REMOVE_TOAST(state){
            // shift : 배열의 첫번째 제거
            state.toasts.shift();
        },

        // mutations은 대문자 작성이 일반적, 명은 우리가 작성, payload는 문법
        UPDATE_TOAST_STATUS(state, payload) {
            state.showToast = payload;
        },
    },
    actions : {
        triggerToast({commit}, {message, type} ) {
            commit( 'UPDATE_TOAST_STATUS', true);
            // commit( 'UPDATE_TOAST_MESSAGE', message);
            // commit( 'UPDATE_TOAST_ALERT_TYPE', type);
            commit('ADD_TOAST', {id:Date.now(), message, type});
            
            setTimeout(()=>{
                commit( 'UPDATE_TOAST_STATUS', false);
                // commit( 'UPDATE_TOAST_MESSAGE', '');
                // commit( 'UPDATE_TOAST_ALERT_TYPE', '');
                commit('REMOVE_TOAST');

            }, 5000);
            
        }
    },
    getters : {
        toastSmileMessage(state){
            return state.toastMessage + "^^";
        }  
    }
}