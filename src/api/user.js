import request from '@/utils/request'

/**
 * 
 * @param {*} data 登录需要的信息
 * @returns Promise
 */
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息
 * @returns Promise
 */
export function getUserInfoApi() {
  return request({
    url: '/sys/profile',
    method: 'post',
  })
}

/**
 * 根据用户ID获取详情数据
 * @param {*} id 用户id
 * @returns 
 */
export function getUserDetail(id) {
  return request({
    url: `/sys/user/${id}`,   
  })
}

