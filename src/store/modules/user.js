import {login,getUserInfoApi,getUserDetail} from '@/api/user'
import { setTokenTime } from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    token:'',
    userInfo:{}
  },
  mutations: {
    //登录
    upDataToken(state,payload){
      state.token = payload
    },
    // 存储用户信息
    setUserInfo(state,payload){
      state.userInfo = payload
    }
  },
  actions: {
    //获取登录token
    async getToken(context,payload){       
        const res = await login(payload)
        // console.log(res);
        context.commit('upDataToken',res)
        setTokenTime()      
    },
    // 获取用户信息
    async getUserInfo(context,payload){
      try {
        const userBaseInfo= await getUserInfoApi()
        // 获取员工信息
        const userInfo = await getUserDetail(userBaseInfo.userId)
        // console.log(userInfo);
        context.commit('setUserInfo',{...userBaseInfo,...userInfo})
      } catch (error) {
        console.log(error);
      }
    },
    //退出登录
    logout(context){
      context.commit('upDataToken','')
      context.commit('setUserInfo',{})
    }
  }
}
