import request from '@/utils/request'

/**
 * 获取数据
 * @param {*} params 
 * @returns 
 */
export function getRolesApi(params) {
    return request({
      url: 'sys/role',
      params
    })
}

/**
 * 新增角色
 * @param {*} data 
 * @returns 
 */
export function addRolesApi(data) {
    return request({
      url: 'sys/role',
      method:"POST",
      data
    })
}

/**
 * 获取企业详情
 * @param {*} data 
 * @returns 
 */
export function getCompanyInfoApi(id) {
    return request({
      url: `/company/${id}`,
      
    })
}