import axios from "axios"

//请求被发送前做的事
axios.interceptors.request.use(config => {
    // Do something before request is sent
    let token = localStorage.getItem("token")?localStorage.getItem("token"):"";
    config.headers.Authorization = token;
    return config;
}, error => {
    // Do something with request error
    return Promise.reject(error);
});

//发送响应前做的事
axios.interceptors.response.use(response => {
    return response.data;
}, error => {
    // Do something with response error
    return Promise.reject(error);
});

/* 封装的get和post请求 
@url:路径
@params:get方式请求参数
@data:post方式请求参数
*/
function get(url,params={}){
    return new Promise((res,rej)=>{
        axios({
            url,
            method:"get",
            params
        }).then(data=>{
            res(data)
        }).catch(err=>{
            rej(err)
        })
    })
};
function post(url,data={}){
    return new Promise((res,rej)=>{
        axios({
            url,
            method:"post",
            data
        }).then(data=>{
            res(data)
        }).catch(err=>{
            rej(err)
        })
    })
}
// 封装包含上传内容的方法
// @url:上传地址
// @data:上传数据
function upload(url,data={}){
    return new Promise((res,rej)=>{
        let form  = new FormData();
        for(var key in data){
            form.append(key,data[key])
        }
        axios({
            url,
            method:"post",
            data:form,
            headers:{
                "Content-Type": "multipart/form-data"
            }
        }).then(data=>{
            res(data)
        }).catch(err=>{
            rej(err)
        })
    })
}
export default{
    get,
    post,
    upload
};