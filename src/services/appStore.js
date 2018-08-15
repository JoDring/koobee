import request from '../util/request'

export function fetchHome(params) {
    return request({
        url:'appstore/html/api/home',
        method: 'get',
        params
    })
}
export function fetchAppDetail(params) {
    return request({
        url:'appstore/appinfo/details',
        method: 'get',
        params
    })
}
export function fetchNeed(params) {
    return request({
        url:'appstore/html/api/need',
        method: 'get',
        params
    })
}
export function fetchGame(params) {
    return request({
        url:'appstore/html/api/game',
        method: 'get',
        params
    })
}
export function fetchRank(params) {
    return request({
        url:'appstore/html/api/rank',
        method: 'get',
        params
    })
}
// 分类
export function fetchCategory(params) {
    return request({
        url:'appstore/html/api/category',
        method: 'get',
        params
    })
}
export function fetchCategoryList(params) {
    return request({
        url:'appstore/html/api/category/list',
        method: 'get',
        params
    })
}
// 搜索
export function fetchSearchResult(data) {
    return request({
        url:'appstore/html/api/search/result',
        method: 'post',
        data
    })
}
export function fetchSearchMatch(data) {
    return request({
        url:'appstore/html/api/search/match',
        method: 'post',
        data
    })
}
export function fetchSearchHotWords() {
    return request({
        url:'appstore/html/api/search/hotwords',
        method: 'get'
    })
}


// ---资讯
export function fetchInformationList(params) {
    return request({
        url:'appstore/html/api/information/list/v2',
        method: 'get',
        params
    })
}
export function fetchInformationDetail(params) {
    return request({
        url:'appstore/html/api/information/detail',
        method: 'get',
        params
    })
}
