import {computed} from 'vue'
import { useStore } from 'vuex';

export const useToast = () => {
    const store = useStore();
    
    // toastBox 관련
    // vuex의 state 접근시 ref로 설정시 즉시 반영 안됨
    // computed 로 접근해서 변경된 값을 참조
    const toasts = computed(() => store.state.toast.toasts );
    const showToast = computed(() => store.state.toast.showToast); 
    
    // 메시지가 전달되면 toastBox 보여주기
    const triggerToast = (message = '', type = 'success') => {
        store.dispatch('toast/triggerToast', {message, type} );
    }
     

     return {
        showToast,
        triggerToast,
        toasts
     }
}