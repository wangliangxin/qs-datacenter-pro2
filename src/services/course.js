/**
 * Courses service
 */

import { request, postRequest, bossBase } from './common'
export const getCourseById = async(courseId) => {
    return await request(bossBase + '/course/getCourseById', {
        params: { courseId }
    })
}

// 获取列表
export const getQueryCourses = async(data) => {

    // // 默认值
    // const data = { current: 1, size: 10 }
    //     // filter， 当页面中没有返回参数，默认参数为 
    // if (filter.current) data.current = filter.current
    // if (filter.size) data.size = filter.size
    return await postRequest(bossBase + '/snoring/getSnoringPages', data)
}

export const changeState = async(courseId, status) => {
    return await request(bossBase + '/course/changeState', {
        params: { courseId, status }
    })
}

export const saveOrUpdateCourse = async(params) => {
    // TODO: update logic
    const data = {...params }
    return await postRequest(bossBase + '/course/saveOrUpdateCourse', data)
}