import Vue from "vue"
import Vuex from "vuex"
import http from "./../utils/http"


Vue.use(Vuex);

let store = new Vuex.Store({
    state:{
        //为了避免刷新，使state里的数据消失,把localStorage里的数据取出赋值
        token:localStorage.getItem("token")?localStorage.getItem("token"):"",
        info:localStorage.getItem("info")?JSON.parse(localStorage.getItem("info")):{},
    },
    mutations:{
        //保存登录信息
        setInfo(state,payload){
            localStorage.setItem("token",payload.token);
            localStorage.setItem("info",JSON.stringify(payload.info));
            state.token = payload.token;
            state.info = payload.info;
        },
        //清空localStorage里的数据
        clearInfo(state){
            // localStorage.clear();
            localStorage.removeItem("token");
            localStorage.removeItem("info");
            state.token = "";
            state.info = {};
        },
        
    },
    actions:{
       
    }
})

export default store