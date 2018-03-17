import axios from 'axios'
const service = axios.create({
    baseURL: process.env.BASE_API,
    timeout: 5000, // request timeout
    transformRequest: [(data) => {
        const  formData = new FormData()
        for(const item in data) {
            if(data.hasOwnProperty(item)) {
                formData.append(item, data[item])
            }
        }
        return formData
}]
})
service.interceptors.request.use(config => {
    // Do something before request is sent
    /* if (store.getters.token) {
      config.headers['X-Token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    } */
    //config.headers['x_real_host'] = store.getters.realHost
    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
    response => response.data,
    /**
     * response.code === '0'
     * response.msg === 'ok'
     */
        //  const res = response.data;
        //     if (res.code !== '0') {
        //       Message({
        //         message: res.msg,
        //         type: 'error',
        //         duration: 5 * 1000
        //       });
        //       // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
        //       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        //         MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        //           confirmButtonText: '重新登录',
        //           cancelButtonText: '取消',
        //           type: 'warning'
        //         }).then(() => {
        //           store.dispatch('FedLogOut').then(() => {
        //             location.reload();// 为了重新实例化vue-router对象 避免bug
        //           });
        //         })
        //       }
        //       return Promise.reject('error');
        //     } else {
        //       return response.data;
        //     }
    error => {
        console.log('err' + error)// for debug
        return Promise.reject(error)
    })

export default service
