import axios from 'axios'
import ElementUI from "element-ui";
import message from "element-ui/packages/message";
import router from "@/router/indexEarly";
import {serverIp} from "../../public/config";

const request = axios.create({
    //baseURL: 'http://localhost:8091',  // 注意！！ 这里是全局统一加上了 后端接口前缀 前缀，后端必须进行跨域配置！
    baseURL: `http://${serverIp}:8094`,
    timeout: 5000
})

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    //Content-Type用于定义网络文件的类型和网页的编码，决定文件接收方将以什么形式、什么编码读取这个文件
    //设置Token
    let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
    if (user) {
        config.headers['token'] = user.token;  // 设置请求头
    }
    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        let res = response.data;
        // 如果是返回的文件
        if (response.config.responseType === 'blob') {
            return res
        }
        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        // 当用户验证不通过的时候，返回login页面
        if (res.code === '401') {
            router.push("/login")
        }
        return res;
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)


export default request

/**
 export 是对外开放此模块内，多个常量、变量、函数或类 作为接口，引用时需要知道名称，且要包含在花括号({})内，多个要用逗号(,)分隔；
 export default 是对外开放此模块内，某一个常量、变量、函数或类 作为此模块的默认接口，一个文件有且只有一个 export default，引用时不需要知道名称，可自定义名称。
 export default 和 export 可以一起使用。

 * **/