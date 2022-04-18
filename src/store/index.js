import {createStore} from 'vuex'
export default createStore({
    // vuex에 데이터 변수 설정, 변경 불가
    state : {
        // toastBox 관련
        showToast : false, // 보이고 안보이고
        toastMessage : '', // 메시지
        toastAlertType : '', // Alert 타입 종류
        toastTimeout : null
    },
    mutations : {
        // mutations은 대문자 작성이 일반적, 명은 우리가 작성, payload는 문법
        UPDATE_TOAST_STATUS(state, payload) {
            state.showToast = payload;
        },
        UPDATE_TOAST_MESSAGE(state, payload) {
            state.toastMessage = payload;
        },
        UPDATE_TOAST_ALERT_TYPE(state, payload) {
            state.toastAlertType = payload;
        },
        UPDATE_TOAST_TIMEOUT(state, payload) {
            state.toastTimeout = payload;
        }
    },
    actions : {
        triggerToast({commit}, {message, type="success"} ) {
            commit( 'UPDATE_TOAST_STATUS', true);
            commit( 'UPDATE_TOAST_MESSAGE', message);
            commit( 'UPDATE_TOAST_ALERT_TYPE', type);
            
            const timeout = setTimeout(()=>{
                commit( 'UPDATE_TOAST_STATUS', false);
                commit( 'UPDATE_TOAST_MESSAGE', '');
                commit( 'UPDATE_TOAST_ALERT_TYPE', '');

            }, 5000);
            commit( 'UPDATE_TOAST_TIMEOUT', timeout);
            
        }
    },
    getters : {
        toastSmileMessage(state){
            return state.toastMessage + "^^";
        }  
    }
});