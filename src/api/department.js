import request from '@/utils/request'
/** *
 *
 * 获取组织架构数据
 * **/
 export function getDepartments() {
    return request({
      url: '/company/department'
    })
}

/** *
 *  根据id根据部门  接口是根据restful的规则设计的   删除 delete  新增 post  修改put 获取 get
 * **/
 export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

/**
 * 添加部门
 * @param {*} data 需要提交的数据
 * @returns promise
 */
 export function addDeptApi(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}

/** *
 * 获取部门详情
 * ***/
 export function getDeptByIdApi(id) {
  return request({
    url: `/company/department/${id}`
  })
}

/**
 * 编辑部门
 *
 * ***/
 export function editDeptsApi(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}