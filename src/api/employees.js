import request from '@/utils/request'

/**
 * 获取员工的简单列表
 * @returns 
 */
export function getEmployeesApi() {
    return request({
      url: 'sys/user/simple'
    })
}
