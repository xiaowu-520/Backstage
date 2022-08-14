import request from '@/utils/request'

/**
 * 获取角色列表
 */
export const getRolesApi = (params) => {
  return request({
    url: 'sys/role',
    params
  })
}

/**
 * 新增角色列表
 */
export const addRolesApi = (params) => {
  return request({
    method: 'POST',
    url: 'sys/role',
    params
  })
}

/**
 * 读取公司信息
 */

export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}
