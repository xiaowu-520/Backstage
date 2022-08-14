import dayjs from 'dayjs' // 引入工具类

// 过滤器
export const  formatTime = (val) => {
    return dayjs(val).format('YYYY-MM-DD')
}